import { Controller, Get, Query, Req, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
//9ee01d55302c58c971a8269f8b03ba43f787b17db78e17b981fb5b3477b2f615966755c22a829ac346a0438a7eca697d0b7d546c02e213ccb6a85281eb74e9aa
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	getHello(): string {
		return this.appService.getHello();
	}
}
