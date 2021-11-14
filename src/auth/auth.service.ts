import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { DatabaseService } from 'src/database/database.service';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

	constructor(private readonly databaseService: DatabaseService) {}
    
    login() {
        return fs.readFileSync('./www/login/index.html', 'utf8');
    }

    async check(username: string, password: string): Promise<boolean> {
        const user = await this.databaseService.userFindOneByUsername(username);
        if (user.password === crypto.createHmac('sha256', password).digest('hex')) return true;
        else return false;
    }
}
