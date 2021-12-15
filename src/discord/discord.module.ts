import { Module } from "@nestjs/common";
import { EgsModule } from "../modules/egs/egs.module";
import { ToolsModule } from "../modules/tools/tools.module";
import { DiscordService } from "./discord.service";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "src/database/database.module";
import { SteamModule } from "../modules/steam/steam.module";
import { GogModule } from "../modules/gog/gog.module";
import { HtlbModule } from "../modules/htlb/htlb.module";
import { AnimeModule } from "./modules/anime/anime.module";
import { AmethystModule } from "../modules/amethyst/amethyst.module";
import { WallhavenModule } from "../modules/wallhaven/wallhaven.module";

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
	exports: [DiscordService],
})
export class DiscordModule {}
