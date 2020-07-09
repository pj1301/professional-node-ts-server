import config from 'config';
import express, { Request, Response, Router } from 'express';
import { setAppMiddleware } from './middleware/appMiddleware';
import { logger } from './utils/logger';

export class App {
  private port: string = process.env.PORT || config.get('port');
  public app!: express.Application;

  public async init() {
    this.app = express();
    setAppMiddleware(this.app);
    this.setRoutes();
  }

  public listen() {
    this.app.listen(this.port, () => logger.info(`Server running on port ${this.port}`));
  }

  private setRoutes(): void {
      this.app.get('/test', (req: Request, res: Response) => {
      logger.info('we\'re hitting the test get route');
      res.status(200).send({message: 'At the Get request'});
    })
  }
}
