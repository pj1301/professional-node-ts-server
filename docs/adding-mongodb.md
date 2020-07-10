# MongoDB

To add MongoDB, we're going to create a single access point to the database and then use that alongside a single service to write and retreieve data as required. 

&nbsp;
## Installation
To install mongodb use:

```bash
npm i mongodb
npm install @types/mongodb
```
_MongoDB requires separate types installation._

&nbsp;
## Configuration
We will need to add the connection information to our config files. First for development:

```json
// ./config/development.json

{
  // ... code omitted
  "mongoDb": {
    "url": "mongodb://localhost:27017",
    "db": "myDB"
  },
  // ... code omitted
}
```
_Change the DB name as required._