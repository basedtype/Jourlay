import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AppService {

	constructor(private readonly databaseService: DatabaseService) {}

	async addAuth(login: string, password: string, role: string): Promise<string> {
		const result = await this.databaseService.addUser(login.toLocaleLowerCase(), password, role);
		return result;
	}
}
