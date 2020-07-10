import { Container } from 'inversify';
import TYPES from '../services/config/types';

// import services below
import { MongoDBConnection } from '../infrastructure/mongoConnection';
import { DatabaseService } from '../services/database.service';

export async function makeContainer() {
  const container = new Container();
  bindServices(container);
  return container;
}

function bindServices(container: Container): void {
  container.bind<MongoDBConnection>(TYPES.MongoDBConnection).to(MongoDBConnection);
  container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
}
