import config from 'config';
import { injectable } from 'inversify';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { logger } from '../utils/logger';

@injectable()
class MongoDBConnection {
  private mongoDbOpt: MongoClientOptions = { useUnifiedTopology: true };
  private dbName: string = config.get('mongoDb.db');
  private url: string = config.get('mongoDb.url');
  private open = false;
  private db!: Db;

  constructor() {}

  public async establishConnection(): Promise<Db | null> {
    if (!this.open) await this.connect();
    logger.info('MongoDB connection established');
    return this.db ? this.db : null;
  }

  private async connect(): Promise<void | false> {
    const client = await MongoClient.connect(this.url, this.mongoDbOpt);
    if (!client) return;
    this.open = true;
    this.db = client.db(this.dbName);
  }
}

export default MongoDBConnection;
