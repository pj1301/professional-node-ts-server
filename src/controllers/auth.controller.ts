import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, next, request, response } from 'inversify-express-utils';
import { RequestWithUser } from '../models/request-with-user.interface';
import { authoriseElevatedUser } from '../security/authorise-user';
import { verify } from '../security/token-verification';
import TYPES from '../services/config/types';
import { DatabaseService } from '../services/database.service';
import { SecurityService } from '../services/security.service';
import { TokenService } from '../services/token.service';
import { UtilService } from '../services/util.service';
import { InvalidCredentials } from '../utils/exceptions/credentials-exception';
import { v1 } from 'uuid';
import { GeneralError } from '../utils/exceptions/general-exception';

@controller('/auth')
export class AuthController {
	constructor(
		@inject(TYPES.DatabaseService) private dbService: DatabaseService,
		@inject(TYPES.TokenService) private tokenService: TokenService,
		@inject(TYPES.SecurityService) private securityService: SecurityService,
		@inject(TYPES.UtilService) private utilService: UtilService
	) {}

	@httpPost('/login')
	public async login(
		@request() req: Request,
		@response() res: Response
	): Promise<void> {
		const user = await this.dbService.findOne('users', {
			email: req.body.email,
		});
		if (!user) throw new InvalidCredentials();
		const checkedPw = await this.securityService.checkPw(
			user.password,
			req.body.password
		);
		if (!checkedPw) throw new InvalidCredentials();
		const token = this.tokenService.generateJWT(user._id, user.role, user.tokenId);
		if (token) {
			res.status(200).send({ token });
		} else {
			throw new Error('An error occurred');
		}
	}

	@httpPost('/register', verify, authoriseElevatedUser)
	public async register(
		@request() req: Request,
		@response() res: Response
	): Promise<void> {
		const { email, password, role } = req.body;
		// tailor validation as required
		if (
			!this.utilService.validateObject(email) ||
			!this.utilService.validateObject(password) ||
			!this.utilService.validateObject(role)
		) throw new InvalidCredentials();
		const encryptedPw = await this.securityService.encrypt(password);
		const user = { email, password: encryptedPw, role };
		const result = await this.dbService.createOne('users', user);
		if (result) {
			res.status(200).send(result);
		} else {
			throw new Error('Bad request');
		}
	}

	@httpGet('/logout', verify)
	public async logout(
		@request() req: RequestWithUser,
		@response() res: Response
	): Promise<void> {
		const { user } = req;
		const locator = { _id: this.utilService.objectifyId(user._id) };
		const tokenId = await v1();
		const update = await this.dbService.updateOne('users', locator, { tokenId });
		if (update) {
			res.status(200).send({ message: 'Successfully logged out' });
		} else {
			throw new GeneralError();
		}
	}
}
