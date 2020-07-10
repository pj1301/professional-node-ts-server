import { Db, MongoClient, MongoClientOptions, MongoError } from 'mongodb';
import { logger } from '../utils/logger';

const connStr = 'mongodb://localhost:27017';
const dbName = 'inversify-express-example';

export class MongoDBConnection {
  private static isConnected: boolean = false;
  private static db: Db;
  private static mongodOpt: MongoClientOptions = { useUnifiedTopology: true };

  public static getConnection(result: (connection: Db) => void) {
    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect((error, db: Db) => {
        if (error) logger.error(error);
        return result(this.db);
      });
    }
  }

  private static connect(result: (error: MongoError, db: Db) => void) {
    MongoClient.connect(connStr, this.mongodOpt, (err, client) => {
      if (err) logger.error(err);
      this.db = client.db(dbName);
      this.isConnected = true;
      return result(err, this.db);
    });
  }
}