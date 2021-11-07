import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';

@Module({
	providers: [AnimeService],
	exports: [AnimeService]
})
export class AnimeModule {}
