import config from 'config';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

class MongoDBConnection {
  private static mongoDbOpt: MongoClientOptions = { useUnifiedTopology: true };
  private static dbName: string = config.get('mongoDb.db');
  private static url: string = config.get('mongoDb.url');
  private static connected: boolean = false;
  private static db: Db;

  constructor() {}

  public static async establishConnection(): Promise<Db | null> {
    if (!this.connected) await this.connect();
    return this.db ? this.db : null;
  }

  private static async connect(): Promise<void | false> {
    const client = await MongoClient.connect(this.url, this.mongoDbOpt);
    if (!client) return;
    this.db = client.db(this.dbName);
    this.connected = true;
  }
}

export default MongoDBConnection;
