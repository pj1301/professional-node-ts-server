import config from 'config';
import express from 'express';
import { setAppMiddleware } from './middleware/appMiddleware';
import { logger } from './utils/logger';

export class App {
  private port: string = process.env.PORT || config.get('port');
  public app!: express.Application;

  public async init() {
    this.app = express();
    setAppMiddleware(this.app);
  }

  public listen() {
    this.app.listen(this.port, () => logger.info(`Server running on port ${this.port}`));
  }
}
