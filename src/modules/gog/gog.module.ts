import { Module } from '@nestjs/common';
import { GogService } from './gog.service';

@Module({
	providers: [GogService],
	exports: [GogService]
})
export class GogModule { }
