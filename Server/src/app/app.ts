import { Server } from 'http';
import { Api } from './api/ApiServer';
import { SerialCommunicator } from './SerialCommunicator/SerialCommunicator';
import { SocketThing } from './sockets/Socket';
import { Persistor } from './Persistor';
import { Container, Service } from 'typedi';
import { SocketClient } from 'app/sockets/SocketClient';
import { ConsoleLogger, Logger } from './utils/Logger';
import { Connector } from './CommunicatorToBusConnector';
import { startServer } from './api/HttpServer';
import { ScenariosManager } from './scenarios/ScenariosManager';
import { Scripts } from './scripts';

const PORT = 3000;

@Service()
export class MHome {
  @Logger('mHome')
  private readonly logger: Logger;

  async init() {
    this.logger.info(
      `Starting mHome | ${new Date()
        .toLocaleString()
        .replace('T', ' ')} local time`,
    );

    // API Express Server
    const api = new Api();
    const expressApp = api.init();

    // HTTP Server
    let httpServer: Server;
    try {
      httpServer = await startServer(PORT, expressApp);
    } catch (error) {
      this.logger.error('Cannot start server:');
      this.logger.error(error);
      return;
    }

    // Socket.io server
    const socketServer = Container.get(SocketThing);
    socketServer.init(httpServer);

    this.logger.info(`Server running at port ${PORT}`);

    // Socket.io client
    Container.set(SocketClient, new SocketClient('http://localhost:3000'));

    // Serial Comunicator
    await setupCommunicator();

    // Connector
    const connector = new Connector();

    // Persistor
    const persistor = Container.get(Persistor);

    // Scripts
    const scripts = Container.get(Scripts);
    scripts.registerScripts();

    // Scenarios
    const scenariosManager = Container.get(ScenariosManager);
  }
}

const setupCommunicator = async () => {
  const logger = new ConsoleLogger('SerialCommunicator', 'ALL');
  const serialPath = process.env.SERIAL_PATH || 'COM3';
  const communicator = new SerialCommunicator(logger, serialPath, 57600);
  await communicator.init();
  Container.set(SerialCommunicator, communicator);
};
