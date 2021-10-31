import { Controller, Get, HttpException, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request, Response } from 'express';
import { Config } from 'types';
import { DatabaseService } from 'src/database/database.service';

@Controller('profile')
export class ProfileController {

	constructor(
        private readonly profileService: ProfileService,
        private readonly databaseService: DatabaseService
        ) { }

    @Get('/')
    loadMainPage() {
        return this.profileService.loadPage('/');
    }

    @Get('/config')
    loadConfigPage() {
        return this.profileService.loadPage('/config');
    }

    @Get('/addService')
    async addService(@Req() request: Request, @Query() query, @Res({ passthrough: true }) response: Response) {
        if (query.service == null) throw new HttpException('Service required', HttpStatus.BAD_REQUEST);
		else if (query.target == null) throw new HttpException('Target required', HttpStatus.BAD_REQUEST);
        else if (query.API == null && query.login == null) throw new HttpException('API or Login required', HttpStatus.BAD_REQUEST);
        else if (query.API != null && query.secret == null) throw new HttpException('Secret required', HttpStatus.BAD_REQUEST);
        else if (query.login != null && query.password == null) throw new HttpException('Password required', HttpStatus.BAD_REQUEST);

        const service: Config.Service = {service: query.service, target: query.target, auth: {}};
        if (query.API != null) {
            service.auth.api = query.API;
            service.auth.secret = query.secret;
        }
        if (query.login != null) {
            service.auth.login = query.login;
            service.auth.password = query.password;
        }
        if (query.description != null) service.description = query.description;

        const res = await this.databaseService.addConfig(service);
        if (res === 'done') response.redirect('/profile/');
        else return res;
    }
}
