import { HttpException } from './http-exception';

export class NotAuthorised extends HttpException {
	constructor(message?: string) {
		super(401, message || 'Not authorised');
	}
}
