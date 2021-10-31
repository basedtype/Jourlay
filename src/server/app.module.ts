import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoadFileMiddleware } from 'src/middleware/loadfiles.middleware';
import { ProfileModule } from 'src/profile/profile.module';
import { DiscordModule } from 'src/modules/discord/discord.module';

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		ProfileModule,
		DiscordModule,
		Logger,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoadFileMiddleware)
			.forRoutes('www');
	}
}