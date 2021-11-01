import { NestFactory } from '@nestjs/core';
import { ConfigurationService } from './configuration/configuration.service';
import { DiscordService } from './modules/discord/discord.service';
import { AppModule } from './server/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.get(DiscordService).init();

	await app.listen(3000);
}
bootstrap();
