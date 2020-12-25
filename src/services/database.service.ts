import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';
import { IDbLocator, IDbLocatorMuliple } from '../models/database.interfaces';
import TYPES from './config/types';

@injectable()
export class DatabaseService {
	constructor(@inject(TYPES.DBClient) private dbConnection: Db) {}

	public async findOne(collection: string, query: object): Promise<any> {
		return await this.dbConnection.collection(collection).findOne(query);
	}

	public async findOneWithFilter(collection: string, query: object, filter: any): Promise<any> {
		return await this.dbConnection.collection(collection).findOne(query, filter);
	}

	public async find(collection: string, query: object): Promise<any> {
		return await this.dbConnection
			.collection(collection)
			.find(query)
			.toArray();
	}

	public async findWithFilter(collection: string, query: object, filter: any): Promise<any> {
		return await this.dbConnection
			.collection(collection)
			.find(query, filter)
			.toArray();
	}

	public async createOne(collection: string, data: object): Promise<any> {
		return await this.dbConnection.collection(collection).insertOne(data);
	}

	public async createMany(
		collection: string,
		data: Array<object>
	): Promise<any> {
		return await this.dbConnection.collection(collection).insertMany(data);
	}

	public async updateOne(
		collection: string,
		locator: IDbLocator,
		data: object
	): Promise<any> {
		return await this.dbConnection
			.collection(collection)
			.findOneAndUpdate(
				locator,
				{ $set: data },
				{ upsert: false, returnOriginal: false }
			);
	}

	public async deleteOne(
		collection: string,
		locator: IDbLocator
	): Promise<any> {
		return await this.dbConnection.collection(collection).deleteOne(locator);
	}

	public async deleteMany(
		collection: string,
		locatorMultiple: IDbLocatorMuliple
	): Promise<any> {
		return await this.dbConnection
			.collection(collection)
			.deleteMany(locatorMultiple);
	}
}
