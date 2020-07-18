import * as Express from 'express';
import * as cors from 'cors';

import { Logger } from './utils';

import 'reflect-metadata';
import { useExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';
useContainer(Container);

export default class App {
  logger: Logger;
  api: Express.Application;

  constructor(port: number) {
    this.logger = new Logger('EXPRESS');
    this.api = Express().use(cors());

    useExpressServer(this.api, {
      controllers: [__dirname + '/api/controllers/*.js'],
    });

    // Health check endpoint
    this.api.get('/', (req, res) => {
      res.send({
        status: 'running',
      });
    })

    // Start server
    this.api.listen(port, () => {
      this.logger.info(`Express server running at port ${port}`);
    });
  }
}
