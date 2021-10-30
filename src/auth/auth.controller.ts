import { Controller, Get, HttpException, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) { }

    @Get('/')
    login() {
        return this.authService.login()
    }

    @Get('/check')
    async check(@Req() request: Request, @Query() query, @Res({ passthrough: true }) response: Response) {
        if (query.login == null) throw new HttpException('Login required', HttpStatus.BAD_REQUEST);
		else if (query.password == null) throw new HttpException('Password required', HttpStatus.BAD_REQUEST);
        const res = await this.authService.check(query.login.toLocaleLowerCase(), query.password);
        if (res === true) {
            response.cookie('auth', 'true', {maxAge: 1000 * 60 * 60 * 24});
            response.redirect('/profile');
        } else {
            return 'Access denied'
        }
    }
}
