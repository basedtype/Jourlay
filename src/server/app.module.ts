/* IMPORT */
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DiscordModule } from "src/discord/discord.module";

@Module({
	imports: [
		ScheduleModule.forRoot(),
		DiscordModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
