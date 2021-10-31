import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EgsModule } from '../egs/egs.module';
import { ToolsModule } from '../tools/tools.module';
import { DiscordService } from './discord.service';
import { ScheduleModule } from '@nestjs/schedule'

@Module({
	imports: [
		DatabaseModule, 
		EgsModule, 
		ToolsModule,
		ScheduleModule,
	],
	providers: [DiscordService],
	exports: [DiscordService]
})
export class DiscordModule { }
