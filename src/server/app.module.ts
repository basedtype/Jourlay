/* IMPORT */
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DiscordModule } from "src/discord/discord.module";
import { TwitchModule } from "src/twitch/twitch.module";

@Module({
	imports: [
		ScheduleModule.forRoot(),
		DiscordModule,
		TwitchModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
