import { registerAs } from '@nestjs/config';
import { join } from 'path/posix';
require('dotenv').config();

const env = process.env;
const conf = {
	wwwPath: env.WWWPATH,
	secret: env.SECRET,
	host: {
		IP: env.HOST_IP,
		PORT: parseInt(env.HOST_PORT),
		protocol: env.HOST_PROTOCOL,
	},
	cron: {
		taskLog: env.CRON_TASKLOG,
	},
	redis: {
		host: env.REDIS_HOST,
		port: parseInt(env.REDIS_PORT),
	},
	postgres: {
		host: env.POSTGRES_HOST,
		port: parseInt(env.POSTGRES_PORT),
		database: env.POSTGRES_DATABASE,
		username: env.POSTGRES_USERNAME,
		password: env.POSTGRES_PASSWORD,
		entities: join(__dirname, JSON.parse(env.POSTGRES_ENTITIES)[0]),
		synchronize: JSON.parse(env.POSTGRES_SYNCHRONIZE),
		migrationsRun: JSON.parse(env.POSTGRES_MIGRATIONSRUN),
		logging: JSON.parse(env.POSTGRES_LOGGING),
		logger: env.POSTGRES_LOGGER,
		migrations: JSON.parse(env.POSTGRES_MIGRATIONS),
		cli: {
			migrationsDir: env.POSTGRES_CLI_MIGRATIONSDIR,
		},
	},
};

export default registerAs('app', () => ({
	secret: conf.secret,
	host: {
		IP: conf.host.IP,
		PORT: conf.host.PORT,
		protocol: conf.host.protocol,
	},
	cron: {
		taskLog: conf.cron.taskLog,
	},
	redis: {
		host: conf.redis.host,
		port: conf.redis.port,
	},
	postgres: {
		host: conf.postgres.host,
		port: conf.postgres.port,
		database: conf.postgres.database,
		entities: [conf.postgres.entities],
		account: {
			login: conf.postgres.username,
			password: conf.postgres.password,
		},
		synchronize: conf.postgres.synchronize,
	},
}));
