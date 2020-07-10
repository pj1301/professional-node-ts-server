import { inject, injectable } from 'inversify';
import { Db, ObjectId } from 'mongodb';
import { MongoDBConnection } from '../infrastructure/mongoConnection';
import { logger } from '../utils/logger';
import { IDbLocator, IDbLocatorMuliple } from './config/interfaces';
import TYPES from './config/types';
import { UtilService } from './util.service';

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

  public async createMany(collection: string, data: Array<object>): Promise<any> {
    return await this.db.collection(collection).insertMany(data);
  }

  public async updateOne(collection: string, locator: IDbLocator, data: object): Promise<any> {
    return await this.db.collection(collection).findOneAndUpdate(locator, {$set: data}, { upsert: false, returnOriginal: false });
  }

  public async deleteOne(collection: string, locator: IDbLocator): Promise<any> {
    return await this.db.collection(collection).deleteOne(locator);
  }

  public async deleteMany(collection: string, locatorMultiple: IDbLocatorMuliple): Promise<any> {
    return await this.db.collection(collection).deleteMany(locatorMultiple);
  }
}
