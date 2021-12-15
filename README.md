# NidhoggBot

One tool - many things

## Getting start

### Installation

```bash
$ npm i
```

### Build the app

```bash
$ npm run build
```

### Running the app

- [recommend] Using PM2:

```bash
$ pm2 start dist/main.js --name="Nidhoggbot" -i 0 
```

- Using nest

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Settings

### .env

You should create a **.env** file

Template:
```
NODE_ENV='development'

WWWPATH=<string>
SECRET=<string>
HOST_IP=<string>
HOST_PORT=<number>
HOST_PROTOCOL=<string>

REDIS_HOST=<string>
REDIS_PORT=<number>

POSTGRES_TYPE='postgres'
POSTGRES_HOST=<string>
POSTGRES_PORT=<number>
POSTGRES_USERNAME=<string>
POSTGRES_PASSWORD=<string>
POSTGRES_DATABASE=<string>
POSTGRES_ENTITIES=[<string>]
POSTGRES_SYNCHRONIZE=<boolean>
POSTGRES_MIGRATIONSRUN=<boolean>
POSTGRES_LOGGING=<boolean>
POSTGRES_LOGGER=<string>
POSTGRES_MIGRATIONS=["<string>"]
POSTGRES_CLI_MIGRATIONSDIR=<string>

PGADMIN_DEFAULT_EMAIL=<string>
PGADMIN_DEFAULT_PASSWORD=<string>
```

### ormconfig.json

For work with migrations you should generate a **ormconfig** file

```bash
$ npm run ormconfig:generate
```

### Migrations

Generate migration

```bash
$ npm run migration:generate
```

Create migration

```bash
$ npm run migration:create
```

Run migrations

```bash
$ npm run migration:run
```

### Typeorm

You can clear all database (**WARNING! You can lose all data**)

```bash
$ npm run typeorm:clear
```