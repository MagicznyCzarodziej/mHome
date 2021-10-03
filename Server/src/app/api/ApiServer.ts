import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { EventBus } from 'app/EventBus/EventBus';
import { router } from 'app/api/routes';

export class Api {
  private app: express.Express;

  init() {
    this.app = express().use(cors()).use(bodyParser.json());
    this.app.get('/health', (req, res) => {
      res.send({
        status: 'OK',
      });
    });
    this.app.use(router);
    return this.app;
  }
}
