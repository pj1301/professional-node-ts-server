# Professional Node Server

This guide will walk through the setup for a professional Node Server.

As usual, this file is simply for set up, running and common issues. For guides on development, please reference the docs folder. 

&nbsp;
## Run
To run from node in development mode (Mongo instance must be running locally):

```bash
npm run dev
```

To seed: make sure that the Mongo instance is running and then run `bash docker_seeds/scripts/seed.sh`.

To run from node in production mode (Mongo instance must be running locally/on server):

```bash
npm start
```

To run via Docker, run:

```bash
docker-compose up

# for background process use
# docker-compose up -d
```

&nbsp;
## Issues

&nbsp;
### No binding for DBClient
If you get the below message:

```bash
(node:3506) UnhandledPromiseRejectionWarning: Error: No matching bindings found for serviceIdentifier: Symbol(DBClient)
```

It is likely that the Mongo database is not running. Please check the running instance of MongoDB. 

&nbsp;

***********

**Author: pj1301**