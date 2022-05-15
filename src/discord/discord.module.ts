import { Module } from '@nestjs/common';
import { EgsModule } from '../modules/egs/egs.module';
import { ToolsModule } from '../modules/tools/tools.module';
import { DiscordService } from './discord.service';
import { SteamModule } from '../modules/steam/steam.module';
import { GogModule } from '../modules/gog/gog.module';
import { HtlbModule } from '../modules/htlb/htlb.module';
import { WallhavenModule } from '../modules/wallhaven/wallhaven.module';
import { DVoice } from './modules/voice';
import { DMusic } from './modules/music';

@Module({
	imports: [
		EgsModule,
		SteamModule,
		GogModule,
		HtlbModule,
		ToolsModule,
		WallhavenModule,
	],
	providers: [DiscordService, DVoice, DMusic],
	exports: [DiscordService],
})
export class DiscordModule {}
