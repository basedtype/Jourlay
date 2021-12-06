import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/configuration/configuration';
import { DiscordLog, DiscordUser } from 'src/entity/discord.entity';
import { Log } from 'src/entity/log.entity';
import { Service } from 'src/entity/services.entity';
import { ServerUser } from 'src/entity/users.entity';
import { DatabaseService } from './database.service';

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
					entities: config.postgres.entities,
					synchronize: config.postgres.synchronize,
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
		TypeOrmModule.forFeature([DiscordUser, Log, Service, DiscordLog, ServerUser])
	],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule { }
