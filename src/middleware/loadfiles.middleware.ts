import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from "fs";
import { join } from 'path/posix';

@Injectable()
export class LoadFileMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.url.split('.')[1] === 'html') throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        res.sendFile(join(__dirname, `../../www${req.url}`));
    }
}