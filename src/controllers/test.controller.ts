import express, { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPatch, httpPost, next, request, response } from 'inversify-express-utils';
import { verify } from '../security/token-verification';
import TYPES from '../services/config/types';
import { DatabaseService } from '../services/database.service';
import { UtilService } from '../services/util.service';
import { InformationNotFound } from '../utils/exceptions/not-found-exception';

@controller('/test', verify)
export class TestController {
	constructor(
		@inject(TYPES.DatabaseService) private dbService: DatabaseService,
		@inject(TYPES.UtilService) private utilService: UtilService
	) {}

	@httpGet('/')
	public async getTestData(
		@request() req: express.Request,
		@response() res: express.Response,
		@next() nxt: NextFunction
	) {
		const result = await this.dbService.find('test', {});
		if (result) {
			res.status(200).send(result)
		 } else {
			throw new InformationNotFound();
		 }
	}

	@httpPost('/')
	public async postTestData(
		@request() req: express.Request,
		@response() res: express.Response,
		@next() nxt: NextFunction
	) {
		const result = await this.dbService.createOne('test', req.body);
		result ? res.status(200).send(result) : nxt(new InformationNotFound());
	}

	@httpPost('/multiple')
	public async postTestDataMultiple(
		@request() req: express.Request,
		@response() res: express.Response,
		@next() nxt: NextFunction
	) {
		const result = await this.dbService.createMany('test', req.body);
		if (result) {
			res.status(200).send(result);
		} else {
			throw new InformationNotFound();
		}
	}

	@httpGet('/:id')
	public async getOneTestData(
		@request() req: express.Request,
		@response() res: express.Response,
		@next() nxt: NextFunction
	) {
		const locator = { _id: this.utilService.objectifyId(req.params.id) };
		const result = await this.dbService.findOne('test', locator);
		if (result) {
			res.status(200).send(result);
		} else {
			throw new InformationNotFound();
		}
	}

	@httpPatch('/:id')
	public async patchTestData(
		@request() req: express.Request,
		@response() res: express.Response,
		@next() nxt: NextFunction
	) {
		const locator = { _id: this.utilService.objectifyId(req.params.id) };
		const result = await this.dbService.updateOne('test', locator, req.body);
		if (result) {
			res.status(200).send(result);
		} else {
			throw new InformationNotFound();
		}
	}

	@httpDelete('/:id')
	public async deleteTestData(@request() req: Request, res: Response) {
		const locator = { _id: this.utilService.objectifyId(req.params.id) };
		const result = await this.dbService.deleteOne('test', locator);
		res.status(200);
	}
}
