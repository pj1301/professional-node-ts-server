# Inversify

This part of the guide deals with Inversify.

&nbsp;
## Theory
Before looking at the implementation of Inversify, let's first clarify the core principle behind it - inversion of control.

**Inversion of Control**
Most documentation will describe IoC as the inversion of the flow of control as opposed to the traditional control flow. Practically, it means the following:

* Instances of dependencies are created before the instance of the class in which they are to be used
* These instances are not created by the class into which they are being imported 

A basic comparison would be that we are going down the Angular/Java/Ruby route rather than the traditional functional NodeJS route. 

Inversion of Control is a design principle which helps to achieve more loosely coupled class design, thereby increasing flexibility in our code.

Before moving on there are some additional concepts that we need to be familiar with.

&nbsp;
### Symbols
Symbols are primitive types (introduced in ES6) which have completely unique identifiers, meaning that a symbol created from the same object/literal will not satisfy the total equality operator `===`. A symbol is created with:

```ts
const symbol1 = new Symbol('Some information');
const symbol2 = new Symbol('Some more information');
const symbol3 = new Symbol('Some information');

console.log(symbol1 === symbol2 ? true : false); // => false
console.log(symbol1 === symbol3 ? true : false); // => false

// proof of primitive type
console.log(typeof symbol1); // => 'symbol
```

Scope wise, symbols exist within the scope inside which they are created, but they are still unique across the application.

&nbsp;
### Decorators
A decorator is an example of a higher-order function which effectively wraps one unit of code inside another. It allows you to hook into your source code and either extend it's functionality or add meta-data. It's most common usage is to help developers to write abstractions to existing code. 

When considering Decorators at first it might be tempting to turn everything into a Decorator, however, it should be reserved for stable code which is reused many times inside your application. 

>Note: It appears that Decorators can only be used with/inside classes.

&nbsp;
## Code

&nbsp;
### Set Up
First add inversify and the express utils package:

```bash
npm install inversify inversify-express-utils reflect-metadata --save
```

Then update tsconfig.json, the following fields must be active with the values specified:

```json
{
  "compilerOptions": {
    "target": "es5",                         
    "module": "commonjs",                     
    "lib": ["ES6", "dom"],                            
    "strict": true,                           
    "moduleResolution": "node",            
    "types": ["reflect-metadata"],                        
    "esModuleInterop": true,                
    "experimentalDecorators": true,        
    "emitDecoratorMetadata": true,         
    "skipLibCheck": true,                     
    "forceConsistentCasingInFileNames": true 
  }
}
```

&nbsp;
### Container & Bindings
To work with IoC, we need to have a central container from which all other classes resolve their dependencies. So let's create one in an independent file. The most important elements of this file are:

* The binding of the database connection 
* The binding of other services from the application


```ts
// inversify.config.ts

import { Container } from 'inversify';
import TYPES from '../services/config/types';
import { MongoClient } from 'mongodb';

// import services below
import { getConnection } from '../infrastructure/mongoConnection';
import { DatabaseService } from '../services/database.service';
import { UtilService } from '../services/util.service';

export async function makeContainer() {
  const container = new Container();
  await bindDB(container);
  bindServices(container);
  return container;
}

async function bindDB(container: Container): Promise<void> {
  const dBConnection = await getConnection();
  if (dBConnection) container.bind<MongoClient>(TYPES.DBClient).toConstantValue(dBConnection);
}

function bindServices(container: Container): void {
  container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
  container.bind<UtilService>(TYPES.UtilService).to(UtilService);
}

```

Each binding will allow us to inject a service into components. It's fairly easy to set up for the regular services, but a little tricky to set up for the MongoDB connection. Unlike with Angular, we don't have the option to set a DB connection to a field using an async request, the connection needs to be readily available when the injection happens. 

Therefore, we establish the connection to the database using asynchronous functions **BEFORE** we bind the database to the container, **AND** when we bind, we bind the connection, not a class.

To make this work we therefore need a DB connection file:

```ts
// mongoConnection.ts

import config from 'config';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { logger } from '../utils/logger';

async function getConnection(): Promise<any> {
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

```

&nbsp;
### TYPES
Finally we need to set a symbol for each of the services we are going to be injecting, as each intection will require a TYPES parameter.

```ts
// types.ts

const TYPES = {
  DBClient: Symbol('DBClient'),
}

export { TYPES };

```

&nbsp;
### Root Server File
**You must import reflect-metadata first!!!**

This file does not need to be changed, only the files which are imported/connected to it. 

```ts
import 'reflect-metadata';

import config from 'config';
import { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import './controllers/controller.module';
import { setAppMiddleware } from './middleware/appMiddleware';
import { makeContainer } from './services/config/inversify.config';
import { logger } from './utils/logger';

export class App {
  private port: string = process.env.PORT || config.get('port');
  public app!: Application;

  public async init() {
    const server = new InversifyExpressServer(await makeContainer(), null, { rootPath: '/api/v1' });
    this.app = server
      .setConfig((application: Application) => setAppMiddleware(application))
      .build();
  }

  public listen() {
    this.app.listen(this.port, () => logger.info(`Server running on port ${this.port}`));
  }
}

```

&nbsp;
## Auth
For auth to work with inversify, we have to change some of the files.

&nbsp;
### Install Packages

```bash
pnpm i jsonwebtoken @types/jsonwebtoken bcrypt @types/bcrypt
```