import { inject, injectable } from 'inversify';
import { Db, ObjectId } from 'mongodb';
import { MongoDBConnection } from '../infrastructure/mongoConnection';
import { logger } from '../utils/logger';
import { IDbLocator } from './config/interfaces';
import TYPES from './config/types';

@injectable()
export class DatabaseService {
  public db!: Db;

  constructor() {
    MongoDBConnection.getConnection((connection: Db) => this.db = connection);
  }

  public async find(collection: string, filter: object): Promise<any> {
    const result = await this.db.collection(collection).find(filter).toArray();
    return result;
  }

  public async createOne(collection: string, data: object): Promise<any> {
    return await this.db.collection(collection).insertOne(data);
  }

  public async updateOne(collection: string, locator: IDbLocator, data: object): Promise<any> {
    return await this.db.collection(collection).findOneAndUpdate(locator, {$set: data}, { upsert: false, returnOriginal: false });
  }

  public async delete(collection: string, locators: Array<ObjectId>): Promise<any> {
    return await this.db.collection(collection).deleteMany({ _id: { $in: locators } });
  }
}
