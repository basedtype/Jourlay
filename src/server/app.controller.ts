import { Controller, Get, Query, Req, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	getHello(): string {
		return this.appService.getHello();
	}
}
