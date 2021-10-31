import { NestFactory } from '@nestjs/core';
import { AppModule } from './server/app.module';
import * as cookieParser from 'cookie-parser';
import { DiscordService } from './modules/discord/discord.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());

	app.get(DiscordService).init();

	await app.listen(80);
}
bootstrap();
