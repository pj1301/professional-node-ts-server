import config from 'config';
import { MongoClient } from 'mongodb';
import { logger } from '../utils/logger';

async function getClient(): Promise<void | MongoClient> {
  let client;
  try {
    client = await MongoClient.connect(config.get('mongoDb.url'), { useUnifiedTopology: true })
  } catch (error) {
      logger.error(error);
      return;
  }
  return client;
}

export { getClient };
