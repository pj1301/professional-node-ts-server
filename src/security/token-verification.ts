import config from 'config';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import jwt from 'jsonwebtoken';
import { DIContainer } from '../services/config/inversify.config';
import TYPES from '../services/config/types';
import { DatabaseService } from '../services/database.service';
import { UtilService } from '../services/util.service';
import { NotAuthorised } from '../utils/exceptions/not-authorised-exception';
import { InformationNotFound } from '../utils/exceptions/not-found-exception';
import { logger } from '../utils/logger';

// CONCEAL THIS VALUE!!!
const secret: string = config.get('webToken.secret');

async function verify(req: Request, res: Response, next: NextFunction): Promise<any> {
  // check headers
  const auth = req.headers?.authorization;
  if (!auth) return next(new NotAuthorised('Token not found'));

  // validate JWT
  const validatedJWT = await validateJWT(auth);
  if (!validatedJWT) return next(new NotAuthorised('Token invalid'));
  const { id } = validatedJWT
  if (!id) return next(new InformationNotFound());

  // check user exists
  const container: Container = DIContainer.getContainer();
  const dbService = container.get<DatabaseService>(TYPES.DatabaseService);
  const utilService = container.get<UtilService>(TYPES.UtilService);
  const user = await dbService.findOne('users', { _id: utilService.objectifyId(id) });

  // continue only if no exception raised
  return user ? next() : next(new NotAuthorised('User not found'));
}

async function validateJWT(token: string): Promise<any> {
  const encrypted = stripToken(token);
  let decoded: any;
  try {
    decoded = await jwt.verify(encrypted, secret);
  } catch (error) {
    logger.error(error);
  }
  return decoded;
}

function stripToken(token: string): string {
  return token.replace(/Bearer /g, '');
}

export { verify };
