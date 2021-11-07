import { Injectable } from '@nestjs/common';
import * as fetch from "request-promise";
import { DatabaseService } from 'src/database/database.service';
import axios from "axios";

@Injectable()
export class AmethystService {

	constructor (
		private readonly databaseService: DatabaseService,
	) {}

    private options = {
		responseType: 'arraybuffer',
		headers: {
            'Authorization': 'Bearer '
        },
	}

	private async getJson(url: string, data, options) {
		return await axios.post(url, data, options).catch(err => console.log(err));
	}

	async crush(urlUser: string): Promise<Buffer> {
		const url = 'https://v1.api.amethyste.moe/generate/crush';
		const config = await this.databaseService.getConfig('Amethyst', 'API');
		this.options.headers.Authorization += config.auth.api;
		const response = await this.getJson(url, {'url': urlUser}, this.options);
		if (response) return response.data;
		else return null;
	}

	async triggered(urlUser: string): Promise<Buffer> {
		const url = 'https://v1.api.amethyste.moe/generate/triggered';
		const config = await this.databaseService.getConfig('Amethyst', 'API');
		this.options.headers.Authorization += config.auth.api;
		const response = await this.getJson(url, {'url': urlUser}, this.options);
		if (response) return response.data;
		else return null;
	}
}