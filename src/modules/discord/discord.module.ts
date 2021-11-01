import { Module } from '@nestjs/common';
import { EgsModule } from '../egs/egs.module';
import { ToolsModule } from '../tools/tools.module';
import { DiscordService } from './discord.service';
import { ScheduleModule } from '@nestjs/schedule'
import { DatabaseModule } from 'src/database/database.module';

@Module({
	imports: [
		DatabaseModule, 
		EgsModule, 
		ToolsModule,
	],
	providers: [DiscordService],
	exports: [DiscordService]
})
export class DiscordModule { }
