import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AmethystService } from './amethyst.service';

@Module({
	imports: [DatabaseModule],
	providers: [AmethystService],
	exports: [AmethystService],
})
export class AmethystModule { }