import { injectable } from 'inversify';
import { Db, ObjectId } from 'mongodb';
import MongoDBConnection from "../infrastructure/mongoConnection";
import { logger } from "../utils/logger";
import { IDbLocator } from "./config/interfaces";

@injectable()
export class DatabaseService {
   private db: any;

  constructor() {
    this.getDatabase().then(result => this.db = result);
  }

  public async find(collection: string, filter: object): Promise<any> {
    console.log(this.db);
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

  private async getDatabase(): Promise<Db | null> {
    return await MongoDBConnection.establishConnection();
  }
}
