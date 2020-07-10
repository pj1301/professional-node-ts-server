import express, { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPatch, httpPost, httpPut, interfaces, request, response } from 'inversify-express-utils';
import TYPES from '../services/config/types';
import { logger } from '../utils/logger';
import {DatabaseService} from "../services/database.service";

@controller('/test')
export class TestController {

  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService
  ) {}

  @httpGet('/')
  public async getTestData(@request() req: express.Request, @response() res: express.Response) {
    const result = await this.dbService.find('test', {});
    res.status(200).send(result);
  }

  @httpPost('/')
  public async postTestData(@request() req: Request, @response() res: Response) {
    const result = await this.dbService.createOne('test', req.body);
    res.status(200).send(result);
  }

  // @httpPatch('/:id')

  // @httpPut('/:id')

  // @httpDelete('/:id')
}
