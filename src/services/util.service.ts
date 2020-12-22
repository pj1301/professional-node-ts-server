import { injectable } from 'inversify';
import { ObjectId, ObjectID } from 'mongodb';

@injectable()
export class UtilService {
	// tslint:disable-next-line: no-empty
	constructor() {}

	public clone(value: any): any {
		if (typeof value !== 'object' || value === null) {
			return value;
		}
		if (Array.isArray(value)) {
			return this.deepArray(value);
		}
		return this.deepObject(value);
	}

	public validateEmail(email: string): boolean {
		const re: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	public objectifyId(id: string): ObjectId {
		return new ObjectId(id);
	}

	public stringifyObjectId(id: ObjectId): string {
		return id.toHexString();
	}

	public validateObject(object: any): boolean {
		if (!object || object === '') return false;
		return true;
	}

	private deepObject(source: any) {
		const result: any = {};
		Object.keys(source).forEach((key: string) => {
			const value = source[key];
			if (value instanceof Date) {
				result[key] = new Date(value.getTime());
			} else {
				result[key] = this.clone(value);
			}
		}, {});
		return result;
	}

	private deepArray(collection: any) {
		return collection.map((value: any) => this.clone(value));
	}
}
