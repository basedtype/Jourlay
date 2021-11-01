/* IMPORT */
import { ConfigurationModule } from '../configuration/configuration.module';
import { DatabaseModule } from '../database/_database.module';
import { AppController } from './app.controller';
import { TaskModule } from '../task/task.module';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import configuration from 'src/configuration/configuration';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';
import { DiscordModule } from 'src/modules/discord/discord.module';

@Module({
	imports: [
		TaskModule,
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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
