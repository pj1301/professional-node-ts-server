import { ObjectId } from "mongodb";

interface IDbLocator {
	_id: ObjectId;
}

interface IDbLocatorMuliple {
	_id: IMultiQueryById;
}

interface IMultiQueryById {
	$in: Array<ObjectId>;
}

export { IDbLocator, IDbLocatorMuliple };
