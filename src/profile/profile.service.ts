import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { DatabaseService } from 'src/database/database.service';
import { Database } from 'types';

@Injectable()
export class ProfileService {

    constructor(
        private readonly databaseService: DatabaseService
        ) { }

    loadPage(path: string) {
        if (path !== '/') return fs.readFileSync(`./www/profile${path}/index.html`, 'utf8');
        return fs.readFileSync('./www/profile/index.html', 'utf8');
    }

    async addService(service): Promise<Database.Result> {
        return await this.databaseService.serviceInsertOne(service);
    }
}
