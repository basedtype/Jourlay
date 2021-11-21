import { Module } from '@nestjs/common';
import { AlisaService } from './alisa.service';
import { AlisaController } from './alisa.controller';

@Module({
  providers: [AlisaService],
  controllers: [AlisaController]
})
export class AlisaModule {}
