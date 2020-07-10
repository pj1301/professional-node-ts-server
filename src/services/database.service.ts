import { inject, injectable } from 'inversify';
import {Db, MongoClient, ObjectId} from 'mongodb';
import { logger } from '../utils/logger';
import { IDbLocator, IDbLocatorMuliple } from './config/interfaces';
import TYPES from './config/types';

@injectable()
export class DatabaseService {

  constructor(
    @inject(TYPES.DBClient) private client: MongoClient
  ) {}

  public async find(collection: string, filter: object): Promise<any> {
    return await this.client.db('inversifyDB').collection(collection).find(filter).toArray();
  }

  public async createOne(collection: string, data: object): Promise<any> {
    return await this.client.db('inversifyDB').collection(collection).insertOne(data);
  }

  public async createMany(collection: string, data: Array<object>): Promise<any> {
    return await this.client.db('inversifyDB').collection(collection).insertMany(data);
  }

  public async updateOne(collection: string, locator: IDbLocator, data: object): Promise<any> {
    return await this.client.db('inversifyDB').collection(collection).findOneAndUpdate(locator, {$set: data}, { upsert: false, returnOriginal: false });
  }

  public async deleteOne(collection: string, locator: IDbLocator): Promise<any> {
    return await this.client.db('inversifyDB').collection(collection).deleteOne(locator);
  }

  public async deleteMany(collection: string, locatorMultiple: IDbLocatorMuliple): Promise<any> {
    return await this.client.db('inversifyDB').collection(collection).deleteMany(locatorMultiple);
  }
}
