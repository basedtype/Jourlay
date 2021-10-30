import { Controller, Get, HttpCode, HttpException, HttpStatus, Query, Req, UseGuards, Response } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get('/addAuth')
	//@UseGuards(AuthGuard)
	async addAuth(@Query() query): Promise<string> {
		if (query.login == null) throw new HttpException('Login required', HttpStatus.BAD_REQUEST);
		else if (query.password == null) throw new HttpException('Password required', HttpStatus.BAD_REQUEST);
		else if (query.role == null) throw new HttpException('Role required', HttpStatus.BAD_REQUEST);
		return this.appService.addAuth(query.login, query.password, query.role);
	}
}