import { HttpException } from "./http-exception";

export class InvalidCredentials extends HttpException {
	constructor(message?: string) {
		super(400, message || "User credentials are invalid");
	}
}
