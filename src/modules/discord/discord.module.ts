import { Module } from '@nestjs/common';
import { EgsModule } from '../egs/egs.module';
import { ToolsModule } from '../tools/tools.module';
import { DiscordService } from './discord.service';
import { ScheduleModule } from '@nestjs/schedule'
import { DatabaseModule } from 'src/database/database.module';
import { SteamModule } from '../steam/steam.module';
import { GogModule } from '../gog/gog.module';
import { HtlbModule } from '../htlb/htlb.module';
import { AnimeModule } from '../anime/anime.module';
import { AmethystModule } from '../amethyst/amethyst.module';
import { WallhavenModule } from '../wallhaven/wallhaven.module';

@Module({
	imports: [
		DatabaseModule, 
		EgsModule,
		SteamModule,
		GogModule,
		HtlbModule,
		ToolsModule,
		AnimeModule,
		AmethystModule,
		WallhavenModule,
	],
	providers: [DiscordService],
	exports: [DiscordService]
})
export class DiscordModule { }
