/* IMPORT */
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DiscordModule } from "src/discord/discord.module";

@Module({
	imports: [
		DiscordModule,
		ScheduleModule.forRoot(),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
