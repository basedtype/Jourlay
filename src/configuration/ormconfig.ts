require('dotenv').config();
import * as fs from 'fs';

const env = process.env;
const conf = {
	type: env.POSTGRES_TYPE,
	host: env.POSTGRES_HOST,
	port: parseInt(env.POSTGRES_PORT),
	database: env.POSTGRES_DATABASE,
	username: env.POSTGRES_USERNAME,
	password: env.POSTGRES_PASSWORD,
	synchronize: JSON.parse(env.POSTGRES_SYNCHRONIZE),
    entities: JSON.parse(env.POSTGRES_ENTITIES),
	migrationsRun: JSON.parse(env.POSTGRES_MIGRATIONSRUN),
	logging: JSON.parse(env.POSTGRES_LOGGING),
	logger: env.POSTGRES_LOGGER,
	migrations: JSON.parse(env.POSTGRES_MIGRATIONS),
	cli: {
		migrationsDir: env.POSTGRES_CLI_MIGRATIONSDIR,
	}
}

const config = JSON.stringify(conf);
fs.writeFileSync(`${__dirname}/../../ormconfig.json`, config);
