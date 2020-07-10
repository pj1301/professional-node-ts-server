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
### Container
To work with IoC, we need to have a central container from which all other classes resolve their dependencies. So let's create one in an independent file:

```ts
import { Container } from 'inversify';
import { DBClient, MongoDatabaseClient } from '../../infrastructure/mongoConnection';
import TYPES from '../config/types';
// import services below

async function makeContainer() {
  const container = new Container();
  // bind the services here
  return container;
}

export { makeContainer };

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

````