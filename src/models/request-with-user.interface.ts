import { Request } from 'express';
import { RequestUser } from './user.interface';

export interface RequestWithUser extends Request {
    user: RequestUser;
}