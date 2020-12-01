import config from "config";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { next, request, response } from "inversify-express-utils";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import TYPES from "./config/types";
import { DatabaseService } from "./database.service";
import { UtilService } from "./util.service";

@injectable()
export class TokenService {
	private secret: string = config.get("webToken.secret");

	constructor(
		@inject(TYPES.DatabaseService) private dbService: DatabaseService,
		@inject(TYPES.UtilService) private utilService: UtilService
	) {}

	public generateJWT(id: string, role: string): string {
		return jwt.sign({ id, role }, this.secret, {
			algorithm: "HS256",
			expiresIn: "1d",
		});
	}
}
