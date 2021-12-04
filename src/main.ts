import { NestFactory } from '@nestjs/core';
import { BinanceService } from './modules/binance/binance.service';
import { DiscordService } from './modules/discord/discord.service';
import { AppModule } from './server/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.get(DiscordService).init();
	app.get(BinanceService).getClient();

	app.enableCors();
	await app.listen(3000);
}
bootstrap();
