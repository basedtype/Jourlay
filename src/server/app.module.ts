/* IMPORT */
import { ConfigurationModule } from '../configuration/configuration.module';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import configuration from 'src/configuration/configuration';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';
import { DiscordModule } from 'src/modules/discord/discord.module';
import { LoadFileMiddleware } from 'src/middleware/loadfiles.middleware';
import { AlisaModule } from 'src/modules/alisa/alisa.module';

@Module({
	imports: [
		ConfigurationModule,
		DatabaseModule,
		ConfigModule,
		BullModule,
		AuthModule,
		ProfileModule,
		DiscordModule,
		ConfigModule.forRoot({
			load: [configuration],
		}),
		ScheduleModule.forRoot(),
		AlisaModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoadFileMiddleware)
			.forRoutes('www');
	}
}
