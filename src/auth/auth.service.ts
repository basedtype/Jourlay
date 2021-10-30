import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {

	constructor(private readonly databaseService: DatabaseService) {}
    
    login() {
        return fs.readFileSync('./www/login/index.html', 'utf8');
    }

    async check(login: string, password: string): Promise<boolean> {
        return await this.databaseService.checkUser(login, password);
    }
}
