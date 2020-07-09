import express, { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPatch, httpPost, httpPut, interfaces, request, response } from 'inversify-express-utils';
import TYPES from '../services/config/types';
import { TestDataService } from '../services/test-data.service';
import { logger } from '../utils/logger';

@controller('/test')
export class TestController {

  constructor(
    @inject(TYPES.TestDataService) private testDataService: TestDataService
  ) {}

  @httpGet('/')
  public async getTestData(@request() req: express.Request, @response() res: express.Response) {
    const data = this.testDataService.getTestData();
    res.status(200).send(data);
  }

  @httpPost('/')
  public async postTestData(@request() req: Request, @response() res: Response) {
    res.status(200).send(req.body);
  }

  // @httpPatch('/:id')

  // @httpPut('/:id')

  // @httpDelete('/:id')
}