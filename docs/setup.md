# Setup

The basic project should include a package.json file, and an src folder.

&nbsp;
## Initialise NPM

To generate the package.json, run `npm init`. Respond to the prompts as desrired and select OK. The one field you should specifically set is the **entry point** this will be `src/server.ts` for this project. 

To begin with we will add the following packages (starred require types packages):

* express
* morgan*
* cors*
* winston
* nodemon
* tslint
* config*

You can run the following to install the packages and the required types packages where not integrated into the core package:

```bash
npm i express morgan @types/morgan cors @types/cors typescript ts-node winston nodemon eslint config @types/config --save
```

_Regular `--save` is for packages that are required for the application to run, `--save-dev` is for development packages._

&nbsp;
## Configure TypeScript and ESLint
To generate a tsconfig.json file, run:	To generate a config file, run:


```bash	```bash
tsc --init	npx eslint --init
```	```

You can leave the default configuration and move on.


ESLint has now taken over from the depreciated TSLint. It should be set up as follows:

To generate a config file, run:

```bash
npx eslint --init
```

This will trigger a selection menu, pick the appropriate options. If you choose a JSON file config, you will get something like the following:


```json
// ./src/.eslintrc.json

{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    }
}

```

&nbsp;
## Docker
Create `./Dockerfile` and `./docker-compose.yml` (in the root directory). 

Dockerfile content as follows:

```dockerfile
# ./Dockerfile

FROM node:14.4-alpine3.10

WORKDIR /server_container

RUN mkdir -p /server_container/node_modules && chown -R node:node /server_container

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 2000

CMD ["npm", "start"]
```

Compose file content as follows:

```yaml
# ./docker-compose.yml

version: "3.8"

services: 
  server:
    build:
      context: .
      dockerfile: Dockerfile
    image: node-server
    container_name: node-server 
    restart: unless-stopped
    volumes: 
      - .:/src
      - node_modules:/src/node_modules
    ports:
      - "2000:2000"
    command: npm start

volumes:
  node_modules:
```

&nbsp;
### Run
To run in Docker, use:

```bash
docker-compose up

# To run in background:
# docker-compose up -d
```

To stop the Docker process:

```bash
docker-compose down
```

To check build logs and Docker process status (respectively):

```bash
docker-compose logs
docker-compose ps
```

If you choose to use Docker you will need to rebuild the server when you make changes - this can be done with:

```bash
docker-compose build
```
You can then run the up command and the changes will have been made.


&nbsp;
## Config
We're also employing configuration assistance from an innovative package called config. To install we use `npm i config` as above. 

To use we need to create a config directory in the root of the project. Here we create a json file for each of our planned environments:

```bash
./config¬
  --development.json
  --staging.json
  --production.json
```

Each should contain a base object (not an array) - at least an empty object.

Then it's simple, you add key value pairs, e.g.

```json
// ./config/development.json

{
  "apiUrl": "/api/v1",
  "allowedOrigins": [
    "http://localhost:4200"
  ],
  "port": "2000"
}
```

To access, import config and then use get to retrieve information:

```ts
import config from 'config';

config.get('key'); // value retrieval
config.has('key'); // boolean indicator
```

&nbsp;
## Core Development Directory
We're going to build a class based server, so we can start by creating our src directory and adding two files:

* server.ts - which will start the server
* app.ts - which will be the base server instance and will contain the configurations for the server

We'll provide the most basic setup possible to start the server and check everything is working thus far. 

Server file contents are as follows:

```ts
// ./src/server.ts

import { App } from './app';

const app: App = new App();

(async () => {
  await app.init();
  app.listen();
})();

```

App file contents are as follows:

```ts
// ./src/app.ts

import express from 'express';

export class App {
  private port: string = process.env.PORT || '2000';
  public app!: express.Application;

  init() {
    this.app = express();
  }

  listen() {
    this.app.listen(this.port, () => console.log(`Server running on port ${this.port}`));
  }
}

```
