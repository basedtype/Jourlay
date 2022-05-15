/* IMPORT */
import { Module } from "@nestjs/common";
import { DiscordModule } from "src/discord/discord.module";

@Module({
	imports: [
		DiscordModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
