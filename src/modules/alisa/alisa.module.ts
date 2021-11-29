import { Module } from '@nestjs/common';
import { AlisaService } from './alisa.service';
import { AlisaController } from './alisa.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  providers: [AlisaService],
  controllers: [AlisaController]
})
export class AlisaModule {}
