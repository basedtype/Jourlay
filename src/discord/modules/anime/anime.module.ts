import { Module } from '@nestjs/common';
import { ToolsModule } from '../../../modules/tools/tools.module';
import { AnimeService } from './anime.service';

@Module({
	imports: [ToolsModule],
	providers: [AnimeService],
	exports: [AnimeService]
})
export class AnimeModule {}
