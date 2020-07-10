import { Container } from 'inversify';
import TYPES from '../services/config/types';
// import services below
import { DatabaseService } from "../services/database.service";

export async function makeContainer() {
  const container = new Container();
  bindServices(container);
  return container;
}

function bindServices(container: Container): void {
  container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
}
