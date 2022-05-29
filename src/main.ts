import { NestFactory } from "@nestjs/core";
import { DiscordService } from "./discord/discord.service";
import { AppModule } from "./server/app.module";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require(`dotenv`).config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.get(DiscordService).init();

	app.enableCors();
	await app.listen(3000);
}
bootstrap();
