import { Container } from 'typedi';
import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';

import { database } from 'database/database';
import {
  SerialMessage,
  SerialMessageSource,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import { SerialCommunicatorObserver } from 'app/interfaces/SerialCommunicatorObserver';
import { LightController } from 'app/controllers/LightController';
import { ThermometerController } from 'app/controllers/ThermometerController';
import { ReedController } from 'app/controllers/ReedController';
import { BlindController } from 'app/controllers/BlindController';
import { ScenarioController } from 'app/controllers/ScenarioController';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { SwitchState } from 'app/utils/SwitchState';
import { Logger } from 'app/utils/Logger';
import {
  decodeTemperature,
  mapRequestIdToSource,
} from 'app/SerialCommunicator/utils';
import { registerScripts } from 'app/scripts';
import { BlindStatus } from 'app/interfaces/BlindStatus';
import { cleanSocketIpAddress } from 'app/utils/cleanSocketIpAddress';

export class MainController implements SerialCommunicatorObserver {
  private io: SocketServer;
  private serialCommunicator: SerialCommunicator;
  private lightController: LightController;
  private thermometerController: ThermometerController;
  private reedController: ReedController;
  private blindController: BlindController;
  private scenarioController: ScenarioController;

  constructor(private logger: Logger, private httpServer: Server) {
    this.serialCommunicator = Container.get(SerialCommunicator);
    this.serialCommunicator.subscribe(this);
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    Container.set(SocketServer, this.io);
    this.lightController = new LightController(this.io);
    this.thermometerController = new ThermometerController(this.io);
    this.reedController = new ReedController(this.io);
    this.blindController = new BlindController(this.io);
    this.scenarioController = new ScenarioController();
    this.handleSockets();
    registerScripts();
  }

  async handleSerialMessage(message: SerialMessage) {
    const source = mapRequestIdToSource(message.requestId);

    switch (message.type) {
      case SerialMessageType.THERMOMETER_RESPONSE: {
        const thermometerId = message.element;
        const temperature = decodeTemperature(message.value, message.auxilary);
        this.thermometerController.addTemperature(thermometerId, temperature);
        break;
      }
      case SerialMessageType.LIGHT_RESPONSE: {
        const lightId = message.element;
        const state = SwitchState.parse(message.value).toString();
        this.lightController.switch(lightId, state);
        await database.history.create({
          data: {
            eventType: 'LIGHT_STATE',
            payload: JSON.stringify({
              elementId: lightId,
              state,
            }),
            source,
          },
        });
        break;
      }
      case SerialMessageType.REED_RESPONSE: {
        const reedId = message.element;
        const state = message.value === 1 ? 'CLOSED' : 'OPEN';
        this.reedController.setReed(reedId, state);
        await database.history.create({
          data: {
            eventType: 'REED_STATE',
            payload: JSON.stringify({
              elementId: reedId,
              state,
            }),
            source,
          },
        });
        break;
      }
      case SerialMessageType.BLIND_RESPONSE: {
        const blindId = message.element;
        const position = message.value;
        const status = [
          BlindStatus.IDLE,
          BlindStatus.MOVING_UP,
          BlindStatus.MOVING_DOWN,
        ][message.auxilary];
        this.blindController.setBlind(blindId, position, status);
        await database.history.create({
          data: {
            eventType: 'BLIND_STATE',
            payload: JSON.stringify({
              elementId: blindId,
              position,
              status,
            }),
            source,
          },
        });
        break;
      }
    }
  }

  handleSockets() {
    this.io.on('connection', async (socket: Socket) => {
      // IP of the client that sent /msg HTTP request to emit socket event
      const socketViaRESTClientIp = socket.handshake.query['ip'] as string;

      const clientIP =
        socketViaRESTClientIp ||
        cleanSocketIpAddress(socket.request.connection.remoteAddress);

      // If socket is from /msg HTTP
      const isLocalClient =
        socket.request.connection.localAddress === undefined;

      const ipString = isLocalClient ? `${clientIP} (via /msg)` : clientIP;

      this.logger.info(
        `Socket client connected ${socket.id} [${ipString}] (Connected: ${
          this.io.of('/').sockets.size
        })`,
      );

      const connectionRecord = await database.connection.create({
        data: {
          ip: clientIP || '',
        },
      });

      socket.onAny((event, data) => {
        this.logger.info(
          `Received event: ${event} [${ipString}] ${JSON.stringify(data)}`,
        );
      });

      socket.on('disconnect', async () => {
        await database.connection.update({
          where: {
            id: connectionRecord.id,
          },
          data: {
            disconnectedAt: new Date().toISOString(),
          },
        });
        this.logger.info(
          `Socket client disconnected ${socket.id} (Connected: ${
            this.io.of('/').sockets.size
          })`,
        );
      });

      // Set light state
      socket.on(SocketMessage.toServer.LIGHT_SET, (data) => {
        try {
          const element = data.id;
          const state = SwitchState.parse(data.state).toInt();
          const message = new SerialMessage(
            SerialMessageSource.SOCKETS,
            SerialMessageType.LIGHT_SET,
            element,
            state,
          );
          this.serialCommunicator.send(message);
        } catch (error) {
          this.logger.error(error);
        }
      });

      // Set state of all lights in the group
      socket.on(SocketMessage.toServer.LIGHTS_SET_GROUP, async (data) => {
        const { groupId } = data;
        const state = SwitchState.parse(data.state).toInt();
        const group = await database.group.findUnique({
          where: { id: groupId },
          include: { lights: true },
        });
        group?.lights.forEach((light: any) => {
          const element = light.id;
          const message = new SerialMessage(
            SerialMessageSource.SOCKETS,
            SerialMessageType.LIGHT_SET,
            element,
            state,
          );
          this.serialCommunicator.send(message);
        });
      });

      // Set state of lights inside
      socket.on(SocketMessage.toServer.LIGHTS_SET_INSIDE, async (data) => {
        const state = SwitchState.parse(data.state).toInt();
        const lights = await database.light.findMany({
          where: {
            NOT: {
              groupId: 'OUTSIDE',
            },
          },
        });
        lights.forEach((light) => {
          const element = light.id;
          const message = new SerialMessage(
            SerialMessageSource.SOCKETS,
            SerialMessageType.LIGHT_SET,
            element,
            state,
          );
          this.serialCommunicator.send(message);
        });
      });

      // Set state of all lights
      socket.on(SocketMessage.toServer.LIGHTS_SET_ALL, async (data) => {
        const state = SwitchState.parse(data.state).toInt();
        const lights = await database.light.findMany({});
        lights.forEach((light) => {
          const element = light.id;
          const message = new SerialMessage(
            SerialMessageSource.SOCKETS,
            SerialMessageType.LIGHT_SET,
            element,
            state,
          );
          this.serialCommunicator.send(message);
        });
      });

      // Set blind position
      socket.on(SocketMessage.toServer.BLIND_SET, async (data) => {
        try {
          const element = data.id;
          const message = new SerialMessage(
            SerialMessageSource.SOCKETS,
            SerialMessageType.BLIND_SET,
            element,
            data.position,
          );
          this.serialCommunicator.send(message);
        } catch (error) {
          this.logger.error(error);
        }
      });
    });
  }
}
