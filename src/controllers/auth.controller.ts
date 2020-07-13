import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import {controller, httpPost, next, request, response} from 'inversify-express-utils';
import TYPES from '../services/config/types';
import { DatabaseService } from '../services/database.service';
import { SecurityService } from '../services/security.service';
import { TokenService } from '../services/token.service';
import { InvalidCredentials } from '../utils/exceptions/credentials-exception';

@controller('/auth')
export class AuthController {

  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService,
    @inject(TYPES.TokenService) private tokenService: TokenService,
    @inject(TYPES.SecurityService) private securityService: SecurityService
  ) {}

  @httpPost('/login')
  public async login(@request() req: Request, @response() res: Response, @next() nxt: NextFunction) {
    const user = await this.dbService.findOne('users', { email: req.body.email });
    if (!user) return nxt(new InvalidCredentials('User credentials not valid'));
    const checkedPw = await this.securityService.checkPw(user.password, req.body.password);
    if (!checkedPw) return nxt(new InvalidCredentials('User credentials not valid'));
    const token = this.tokenService.generateJWT(user._id, user.role);
    res.status(200).send(token);
  }

  @httpPost('/register')
  public async register(@request() req: Request, @response() res: Response) {
    const { email, password, role } = req.body;
    const encryptedPw = await this.securityService.encrypt(password);
    const user = { email, password: encryptedPw, role };
    const result = await this.dbService.createOne('users', user);
    result ? res.status(200).send(result) : res.status(500).send({ message: 'bad request' });
    res.status(200);
  }
}
