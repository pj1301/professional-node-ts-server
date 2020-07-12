import {controller, httpPost, request, response} from "inversify-express-utils";
import { Request, Response } from 'express';
import { inject } from "inversify";
import { DatabaseService } from "../services/database.service";
import TYPES from "../services/config/types";
import { TokenService } from "../services/token.service";
import { SecurityService } from "../services/security.service";

@controller('/auth')
export class AuthController {

  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService,
    @inject(TYPES.TokenService) private tokenService: TokenService,
    @inject(TYPES.SecurityService) private securityService: SecurityService
  ) {}

  @httpPost('/login')
  public async login(@request() req: Request, @response() res: Response) {
    const response = await this.dbService.find('users', { email: req.body.email });
    const user = response[0];
    if (!user) return res.status(500).send({ message: 'User credentials not valid' });
    if (req.body.password !== user.password) return res.status(500).send({ message: 'User credentials not valid' });
    const token = this.tokenService.generateJWT(user._id, user.role);
    res.status(200).send(token);
  }

  @httpPost('/register')
  public async register(@request() req: Request, @response() res: Response) {
    // const user = 
    // this.securityService.encrypt(req.body.password);
    const result = await this.dbService.createOne('users', req.body);
    result ? res.status(200).send(result) : res.status(500).send({ message: 'bad request' });
  }
}
