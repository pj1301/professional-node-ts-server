import { Container } from 'inversify';
import TYPES from '../services/config/types';
import { MongoClient } from 'mongodb';

// import services below
import { getClient } from '../infrastructure/mongoConnection';
import { DatabaseService } from '../services/database.service';
import { UtilService } from '../services/util.service';

export async function makeContainer() {
  const container = new Container();
  await bindDB(container);
  bindServices(container);
  return container;
}

async function bindDB(container: Container): Promise<void> {
  const dBClient = await getClient();
  if (dBClient) container.bind<MongoClient>(TYPES.DBClient).toConstantValue(dBClient);
}

function bindServices(container: Container): void {
  container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
  container.bind<UtilService>(TYPES.UtilService).to(UtilService);
}
