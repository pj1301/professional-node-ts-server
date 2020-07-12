import { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import TYPES from '../services/config/types';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import config from 'config';
import { DatabaseService } from '../services/database.service';
import { DIContainer } from '../services/config/inversify.config';
import { UtilService } from "../services/util.service";

const secret: string = config.get('webToken.secret');

async function verify(req: Request, res: Response, next: NextFunction): Promise<any> {
  const auth = req.headers?.authorization;
  if (!auth) return res.status(401).send({ message: 'Not authorised' });
  const { id } = await validateJWT(auth);
  const container: Container = DIContainer.getContainer();
  const dbService = container.get<DatabaseService>(TYPES.DatabaseService);
  const utilService = container.get<UtilService>(TYPES.UtilService);
  const user = dbService.find('users', { _id: utilService.objectifyId(id) });
  user ? next() : res.status(500).send({ message: 'Token invalid' });
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
