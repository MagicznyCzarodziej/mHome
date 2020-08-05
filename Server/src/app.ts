import * as Express from 'express';
import * as cors from 'cors';
import * as socketIoClient from 'socket.io-client';
import { Server } from 'http';

import SocketHandler from './sockets';
import SerialCommunicator from './SerialCommunicator';
import { Logger } from './utils';

import 'reflect-metadata';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';
useContainer(Container);

export default class App {
  logger: Logger;
  api: Express.Application;

  constructor(port: number) {
    this.logger = new Logger('EXPRESS');

    this.api = Express().use(cors());
    const server = new Server(this.api);
    
    new SocketHandler(server, new Logger('SocketHandler'));
    
    // Health check endpoint
    this.api.get('/', (req, res) => {
      res.send({
        status: 'running',
      });
    })

    // Handle messages without client
    this.api.get('/msg', (req, res) => {
      try {
        const {message, ...data} = req.query;

        socketIoClient
          .connect('http://localhost:' + port)
          .emit(message.toString(), data, (error: any) => {
            if (error) {
              return res.status(400).send({
                error: {
                  message: 'INVALID REQUEST',
                  details: error,
                },
              });
            }
            
            res.send({
              success: true,
              error: error,
              message,
              data,
            });
          });
      } catch(error) {
        this.logger.error('Invalid message from /msg: ' + error);
        
        res.status(400).send({
          error: {
            message: 'INVALID REQUEST',
          },
        });
      }
      
    })

    // Start server
    server.listen(port, () => {
      this.logger.info(`Express server running at port ${port}`);
    });
  }
}
