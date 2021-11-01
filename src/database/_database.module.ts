import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from "../configuration/configuration";

const config = configuration();

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => {
				return {
					type: 'postgres',
					host: config.postgres.host,
					port: config.postgres.port,
					username: config.postgres.account.login,
					password: config.postgres.account.password,
					database: config.postgres.database,
					entities: [__dirname + '/../**/*.entity{.ts,.js}'],
					synchronize: false, // TRUE only in development env
					migrationsRun: false,
					logging: true,
					logger: 'file',
					migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
					cli: {
						migrationsDir: 'src/database/migrations',
					},
				}
			},
		}),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule { }
