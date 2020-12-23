import config from 'config';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

@injectable()
export class TokenService {
	private secret: string = config.get('webToken.secret');

	constructor() {}

	public generateJWT(id: string, role: string, tokenId: string): string {
		return jwt.sign({ id, role, tokenId }, this.secret, {
			algorithm: 'HS256',
			expiresIn: '1d',
		});
	}
}
