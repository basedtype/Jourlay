import { NestFactory } from '@nestjs/core';
import { AppModule } from './server/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	await app.listen(80);
}
bootstrap();
