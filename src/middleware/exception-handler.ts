import { NextFunction, Request, Response } from "express"; // NextFunction must be included
import { HttpException } from "../utils/exceptions/http-exception";

function exceptionHandler(
	error: HttpException,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const message = error.message || "Something went wrong";
	const status = error.status || 500;
	const data = error.data || undefined;
	res.status(status).send({ message, data } as HttpException);
}

export { exceptionHandler };
