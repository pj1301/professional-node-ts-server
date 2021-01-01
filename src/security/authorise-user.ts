import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../models/request-with-user.interface';
import { NotAuthorised } from '../utils/exceptions/not-authorised-exception';

const authorisedUsers = ['horus', 'admin'];

export function authoriseElevatedUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): void {
    if (!authorisedUsers.includes(req.user.role)) throw new NotAuthorised();
    next();
}
