import { registerAs } from '@nestjs/config';
import * as fs from 'fs';

const env = process.env.NODE_ENV;
let conf = null;
let postgresConfig = null;
if (env == null || env === 'development') {
	const config = fs.readFileSync('./config.json', 'utf-8');
	conf = JSON.parse(config);
	postgresConfig = JSON.parse(fs.readFileSync('./ormconfig.json', 'utf-8'));
} else if (env === 'production') {
	const config = fs.readFileSync('/etc/metricator/config.json', 'utf-8');
	conf = JSON.parse(config);
	postgresConfig = JSON.parse(fs.readFileSync('/etc/metricator/ormconfig.json', 'utf-8'));
}

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
		port: conf.redis.port
	},
	postgres: {
		host: postgresConfig.host,
		port: postgresConfig.port,
		database: postgresConfig.database,
		account: {
			login: postgresConfig.username,
			password: postgresConfig.password,
		},
	},
}));
