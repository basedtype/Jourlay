import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoadFileMiddleware } from 'src/middleware/loadfiles.middleware';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		ProfileModule
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