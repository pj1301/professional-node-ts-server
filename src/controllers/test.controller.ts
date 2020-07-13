import express, { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils';
import { verify } from '../security/token-verification';
import TYPES from '../services/config/types';
import { DatabaseService } from '../services/database.service';
import { UtilService } from '../services/util.service';

@controller('/test', verify)
export class TestController {
  private sendError = { message: 'Database operation failed' };

  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService,
    @inject(TYPES.UtilService) private utilService: UtilService
  ) {}

  @httpGet('/')
  public async getTestData(@request() req: express.Request, @response() res: express.Response) {
    const result = await this.dbService.find('test', {});
    result ? res.status(200).send(result) : res.status(500).send(this.sendError);
  }

  @httpPost('/')
  public async postTestData(@request() req: Request, @response() res: Response) {
    const result = await this.dbService.createOne('test', req.body);
    result ? res.status(200).send(result) : res.status(500).send(this.sendError);
  }

  @httpPost('/multiple')
  public async postTestDataMultiple(@request() req: Request, @response() res: Response) {
    const result = await this.dbService.createMany('test', req.body);
    result ? res.status(200).send(result) : res.status(500).send(this.sendError);
  }

  @httpPatch('/:id')
  public async patchTestData(@request() req: Request, @response() res: Response) {
    const locator = { _id: this.utilService.objectifyId(req.params.id) };
    const result = await this.dbService.updateOne('test', locator, req.body);
    result ? res.status(200).send(result) : res.status(500).send(this.sendError);
  }

  @httpDelete('/:id')
  public async deleteTestData(@request() req: Request, res: Response) {
    const locator = { _id: this.utilService.objectifyId(req.params.id) };
    const result = await this.dbService.deleteOne('test', locator);
    res.status(200);
  }
}
