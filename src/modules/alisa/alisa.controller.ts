import { Controller, Get, Req } from '@nestjs/common';

@Controller('alisa')
export class AlisaController {
    @Get()
    async test(@Req() request) {
        console.log(request)
    }
}
