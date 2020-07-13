import { Container } from 'inversify';
import { Db } from 'mongodb';
import TYPES from './types';

// import services below
import { getConnection } from '../../infrastructure/mongoConnection';
import { DatabaseService } from '../database.service';
import { SecurityService } from '../security.service';
import { TokenService } from '../token.service';
import { UtilService } from '../util.service';

export class DIContainer {
  private static container: Container;

  public static async makeContainer(): Promise<Container> {
    this.container = new Container();
    await this.bindDB();
    this.bindServices();
    return this.getContainer();
  }

  public static getContainer(): Container {
    return this.container;
  }

  private static async bindDB(): Promise<void> {
    const dBConnection = await getConnection();
    if (dBConnection) this.container.bind<Db>(TYPES.DBClient).toConstantValue(dBConnection);
  }

  private static bindServices(): void {
    this.container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
    this.container.bind<UtilService>(TYPES.UtilService).to(UtilService).inSingletonScope();
    this.container.bind<SecurityService>(TYPES.SecurityService).to(SecurityService).inSingletonScope();
    this.container.bind<TokenService>(TYPES.TokenService).to(TokenService).inSingletonScope();
  }
}
