import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AlisaService } from './alisa.service';

@Controller('alisa')
export class AlisaController {

    constructor(
        private readonly alisaService: AlisaService
    ) {}

    @Post()
    async test(@Body() body, @Res() response) {
        const command = body.request.command;
        response.json(await this.alisaService.manager(command));
    }
}
