import Container from 'typedi';
import { Server } from 'http';
import * as socketIo from 'socket.io';

import { Logger, SocketEvent, MessageHandler } from '../utils';
import SerialCommunicator, { Message, MessageType } from '../SerialCommunicator';

import LightsSetHandler from './handlers/LightSet';
import LightsRequestHandler from './handlers/LightRequest';
import ThermometerResponseHandler from './handlers/ThermometerResponse';
import ThermometerRequestHandler from './handlers/ThermometerRequest';
import LightResponseHandler from './handlers/LightResponse';

export default class SocketHandler {
  io: socketIo.Server;
  logger: Logger;
  serialCommunicator: SerialCommunicator;

  constructor(httpServer: Server, logger: Logger) {
    this.io = socketIo(httpServer);
    this.logger = logger;
    this.serialCommunicator = Container.get(SerialCommunicator);
    this.serialCommunicator.subscribe(this.handleIncomingMessage.bind(this));

    const handlers = new Map<SocketEvent, MessageHandler>();
    
    handlers.set(SocketEvent.LIGHTS_SET, new LightsSetHandler(this.serialCommunicator));
    handlers.set(SocketEvent.LIGHTS_REQUEST, new LightsRequestHandler(this.serialCommunicator));
    handlers.set(SocketEvent.THERMOMETER_REQUEST, new ThermometerRequestHandler(this.serialCommunicator));

    this.registerMessageHandlers(handlers);
  }

  registerMessageHandlers(handlers: Map<SocketEvent, MessageHandler>) {
    this.io.on('connection', (socket) => {
      handlers.forEach((handler, eventName) => {
        socket.on(eventName, handler.execute.bind(handler));
      });
    });
  }

  handleIncomingMessage(message: Message) {
    switch (message.type) {
      case MessageType.THERMOMETER_RESPONSE:
        new ThermometerResponseHandler(this.io).execute(message);
        break;
      case MessageType.LIGHT_RESPONSE:
        new LightResponseHandler(this.io).execute(message);
        break;
    }
  }
}
