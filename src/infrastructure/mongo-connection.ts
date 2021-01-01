import config from 'config';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { logger } from '../utils/logger';

async function getConnection(): Promise<Db | void> {
	const { db, url, mongodOpt } = config.get('mongoDb');
	let client;
	try {
		client = await getClient(url, mongodOpt);
	} catch (err) {
		logger.error('Error connecting to the database');
		return;
	}
	if (!client) return;
	logger.info('Successfully initialised MongoDB connection');
	return await connect(client, db);
}

async function getClient(url: string, mongodOpt: MongoClientOptions): Promise<void | MongoClient> {
	return await MongoClient.connect(url, mongodOpt);
}

async function connect(client: MongoClient, dbName: string): Promise<Db> {
	return client.db(dbName);
}

export { getConnection };
