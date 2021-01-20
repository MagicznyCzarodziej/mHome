import Express from 'express';
import cors from 'cors';
import socketIoClient from 'socket.io-client';
import { Server } from 'http';
import 'reflect-metadata';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';

import { StandardLogger, Logger } from 'app/utils/Logger';
import { MainController } from './controllers/MainController';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { router } from 'app/routes';

useContainer(Container);

export default class App {
  logger: Logger;
  api: Express.Application;

  constructor(port: number) {
    this.logger = new StandardLogger('Express');
    this.api = Express().use(cors());
    const server = new Server(this.api);

    new MainController(new StandardLogger('MainController'), server);

    // Health check endpoint
    this.api.get('/', (req, res) => {
      res.send({
        status: 'running',
      });
    });

    this.api.use(router);

    // Handle messages without client
    this.api.get('/msg', (req, res) => {
      try {
        const { message, ...data } = req.query;
        if (typeof message !== 'string')
          throw new Error('INVALID REQUEST - MISSING MESSAGE PARAM');
        if (!Object.values(SocketMessage.toServer).includes(message))
          throw new Error('INVALID REQUEST - INVALID MESSAGE TYPE');

        socketIoClient
          .connect('http://localhost:' + port)
          .emit(message.toString(), data);
        res.send({
          success: true,
          message,
          data,
        });
      } catch (error) {
        // TODO: Create file logger and logging levels and outputs so this is not logged to main log
        this.logger.info(
          `Invalid message from /msg (received: ${req.originalUrl}) ${error}`,
        );

        res.status(400).send({
          error: {
            message: error.message,
          },
        });
      }
    });

    // Start server
    server.listen(port, () => {
      this.logger.info(`Express server running at port ${port}`);
    });
  }
}
