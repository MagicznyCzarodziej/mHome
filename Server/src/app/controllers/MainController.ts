import { Container } from 'typedi';
import { Server } from 'http';
import socketIO from 'socket.io';

import { database } from 'database/database';
import {
  SerialMessage,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import { SerialCommunicatorObserver } from 'app/interfaces/SerialCommunicatorObserver';
import { LightController } from 'app/controllers/LightController';
import { ThermometerController } from 'app/controllers/ThermometerController';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { SwitchState } from 'app/utils/SwitchState';
import { Logger } from 'app/utils/Logger';
import { decodeTemperature } from 'app/SerialCommunicator/utils';
import { registerScripts } from 'app/scripts';

export class MainController implements SerialCommunicatorObserver {
  private io: SocketIO.Server;
  private serialCommunicator: SerialCommunicator;
  private lightController: LightController;
  private thermometerController: ThermometerController;

  constructor(private logger: Logger, private httpServer: Server) {
    this.serialCommunicator = Container.get(SerialCommunicator);
    this.serialCommunicator.subscribe(this);
    this.io = socketIO(this.httpServer);
    this.lightController = new LightController(this.io);
    this.thermometerController = new ThermometerController(this.io);
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
    }
  }

  handleSockets() {
    this.io.on('connection', (socket) => {
      // Set light state
      socket.on(SocketMessage.toServer.LIGHT_SET, (data) => {
        try {
          const element = data.id;
          const state = SwitchState.parse(data.state).toInt();
          const message = new SerialMessage(
            SerialMessageType.LIGHT_SET,
            element,
            state
          );
          this.serialCommunicator.send(message);
        } catch (error) {
          this.logger.error(error);
        }
      });

      // Set state of all lights in the group
      socket.on(SocketMessage.toServer.GROUP_LIGHTS_SET, async (data) => {
        const { groupId } = data;
        const state = SwitchState.parse(data.state).toInt();
        const group = await database.group.findOne({
          where: { id: groupId },
          include: { lights: true },
        });
        group?.lights.forEach((light) => {
          const element = light.id;
          const message = new SerialMessage(
            SerialMessageType.LIGHT_SET,
            element,
            state
          );
          this.serialCommunicator.send(message);
        });
      });
    });
  }
}
