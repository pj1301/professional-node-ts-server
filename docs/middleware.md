# Adding Middleware

This guide will deal with executing middleware in the Node application.

&nbsp;
## Set Up
First create the directory: `./src/middleware`. Inside this folder we will add middleware functions etc. We can house our immediate app middelware (such as the body parser, CORS etc.) in a single file:

```ts
// ./src/middleware/app-middleware.ts

import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import config from 'config'; // config is our environment file

// retrieve environment variables from config
const allowedOrigins: Array<string> = config.get('allowedOrigins');

/*
  Notes on the corsOptions:
  - Origin can be multiple things, one of which is a string
  - Here we allow connections which have no origin or an origin which is not a string
  - We reject any access from an unknown origin
*/
const corsOptions: CorsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || typeof origin !== 'string') return callback(null, true);
    if (!allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin blocked by CORS'), false)
  },
  credentials: false
}

function setAppMiddleware(app: Application): void {
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors(corsOptions));
}

export { setAppMiddleware };

```

&nbsp;
## Additional Middlewares
For specialised middlewares, you should create separate files with exported functions which apply those middlewares. 

&nbsp;
### Exception Handler
One of the additional middlewares we can add is an exception handler. Rather than sending errors from the components, we create a central location to handle errors and manage the termination of a web-request.

Create a file for error handling in the middlewares folder:

```ts

```