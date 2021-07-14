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
import { ScenarioController } from 'app/controllers/ScenarioController';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { SwitchState } from 'app/utils/SwitchState';
import { Logger } from 'app/utils/Logger';
import { decodeTemperature } from 'app/SerialCommunicator/utils';
import { registerScripts } from 'app/scripts';

export class MainController implements SerialCommunicatorObserver {
  private io: SocketServer;
  private serialCommunicator: SerialCommunicator;
  private lightController: LightController;
  private thermometerController: ThermometerController;
  private reedController: ReedController;
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
    this.lightController = new LightController(this.io);
    this.thermometerController = new ThermometerController(this.io);
    this.reedController = new ReedController(this.io);
    this.scenarioController = new ScenarioController();
    this.handleSockets();
    registerScripts();
  }

  handleSerialMessage(message: SerialMessage) {
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
        break;
      }
      case SerialMessageType.REED_RESPONSE: {
        const reedId = message.element;
        const state = message.value === 1 ? 'CLOSED' : 'OPEN';
        this.reedController.setReed(reedId, state);
        break;
      }
    }
  }

  handleSockets() {
    this.io.on('connection', (socket: Socket) => {
      this.logger.info(
        `Socket client connected ${socket.id} (Connected: ${
          this.io.of('/').sockets.size
        })`,
      );

      socket.on('disconnect', () => {
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

      // Set state of all lights
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
    });
  }
}
