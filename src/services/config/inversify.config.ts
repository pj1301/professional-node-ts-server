import { Container } from 'inversify';
import { DBClient, MongoDatabaseClient } from '../../infrastructure/mongoConnection';
import TYPES from '../config/types';
// import services below
import { TestDataService } from '../test-data.service';

async function makeContainer() {
  const container = new Container();
  // const dbClient = await new MongoDatabaseClient().getDatabaseClient();
  // container.bind<DBClient>(TYPES.DBClient).toConstantValue(dbClient);
  container.bind<TestDataService>(TYPES.TestDataService).to(TestDataService).inSingletonScope();
  return container;
}

export { makeContainer };
