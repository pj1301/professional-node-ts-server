# Configuring Logging

Logging should not be done via console log in a professional node server, but rather than including debug, we should implement a logger which can be used for all environment types. 

We will use Winston for this project. 

&nbsp;
## Install
You should have already installed from the setup, just check the package.json to ensure the package is listed. 

If not run:

```bash
npm i winston
```

&nbsp;
## Configure
We will create a util to provide logging. Create the file `./src/util/logger.ts` and insert the following content:

```ts
// ./src/util/logger.ts

import { createLogger, format, Logger, transports } from 'winston';
// unpack format
const { combine, colorize, simple, timestamp } = format;
// set level based upon environment - debug level for development server, errors only for production
const level: string = process.env.NODE_ENV === 'production' ? 'error' : 'debug'
// set common format options for logs
const formatOpt: any = combine(colorize(), simple(), timestamp());

const loggerOptions = {
  level,
  format: formatOpt,
  transports: [
    new transports.Console({ level, format: formatOpt,  silent: false }) // sets logs to come to the console, can also be set to go to a File
  ]
};

const logger: Logger = createLogger(loggerOptions);
// log the server environment at startup/restart
logger.info(`Logging initialised on ${process.env.NODE_ENV} server`);

export { logger }

```

&nbsp;
## Using Logger
To use logger in your code, you will first need to import the exported `logger`:

```ts
import { logger } from '/path/to/util/logger';
```

You then have the following options for log types:

**Info**
```ts
logger.info('message here as a string')
```

**Error**
```ts
logger.error('message here as a string')
```

**Debug**
```ts
logger.debug('message here as a string')
```