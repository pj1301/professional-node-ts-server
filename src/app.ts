import 'reflect-metadata';

import config from 'config';
import { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import './controllers/controller.module';
import { setAppMiddleware } from './middleware/appMiddleware';
import { makeContainer } from './services/config/inversify.config';
import { logger } from './utils/logger';

export class App {
  private port: string = process.env.PORT || config.get('port');
  public app!: Application;

  public async init() {
    const server = new InversifyExpressServer(await makeContainer(), null, { rootPath: '/api/v1' });
    this.app = server
      .setConfig((application: Application) => setAppMiddleware(application))
      .build();
  }

  public listen() {
    this.app.listen(this.port, () => logger.info(`Server running on port ${this.port}`));
  }
}
