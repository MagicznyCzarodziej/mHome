import Container from 'typedi';
import { Server } from 'http';
import * as socketIo from 'socket.io';

import { Logger, SocketEvent, MessageHandler } from '../utils';
import SerialCommunicator from '../SerialCommunicator';

import LightsSetHandler from './handlers/LightsSet';
import LightsRequestHandler from './handlers/LightsRequest';

export default class SocketHandler {
  io: socketIo.Server;
  logger: Logger;
  serialCommunicator: SerialCommunicator;

  constructor(httpServer: Server, logger: Logger) {
    this.io = socketIo(httpServer);
    this.logger = logger;
    this.serialCommunicator = Container.get(SerialCommunicator);

    const handlers = new Map<SocketEvent, MessageHandler>();
    
    handlers.set(SocketEvent.LIGHTS_SET, new LightsSetHandler(this.serialCommunicator, this.io));
    handlers.set(SocketEvent.LIGHTS_REQUEST, new LightsRequestHandler(this.serialCommunicator));

    this.registerMessageHandlers(handlers);
  }

  registerMessageHandlers(handlers: Map<SocketEvent, MessageHandler>) {
    this.io.on('connection', (socket) => {
      handlers.forEach((handler, eventName) => {
        socket.on(eventName, handler.execute.bind(handler));
      });
    });
  }
}
