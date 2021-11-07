import { Injectable } from '@nestjs/common';
import * as fetch from "request-promise";

@Injectable()
export class AnimeService {
    private options = {
		method: 'GET',
		headers: {}
	}

	private async getJson(url: string, options) {
		return JSON.parse(await fetch(url, options))
	}

	async getRandomPhoto(): Promise<string> {
		const url = 'https://nekos.best/api/v1/nekos?amount=1';
		const response = await this.getJson(url, this.options);
		return response.url[0].url;
	}
}
