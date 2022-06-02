# Jourlay

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

- [Recommend] Using Docker:

```bash
$ docker-compose up -d
```

- [Not recommend] Using PM2:

```bash
$ pm2 start dist/main.js --name="Nidhoggbot" -i 0 
```

- [Not recommend] Using nest

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

You should create a **.env** file. Look into `.env.template`.


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
