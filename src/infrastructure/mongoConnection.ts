import config from 'config';
import { MongoClient, MongoClientOptions } from 'mongodb';

type DBClient = MongoClient;

class MongoDatabaseClient {
  public client!: MongoClient;
  private mongoDbOpt: MongoClientOptions = { useUnifiedTopology: true };

  public async getDatabaseClient(): Promise<MongoClient> {
    const  client = new MongoClient(config.get('mongoDb.url'), this.mongoDbOpt);
    return await client.connect();
  }

  public closeClient(): void {
    this.client.close();
  }
}

export { MongoDatabaseClient, DBClient };
