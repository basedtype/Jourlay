import { Injectable } from '@nestjs/common';
import * as fetch from "request-promise";
import * as HMfull from "hmfull";
import { ToolsService } from '../../../modules/tools/tools.service';
import { RandomPHUB } from 'discord-phub';

@Injectable()
export class AnimeService {

	constructor(
		private readonly toolService: ToolsService,
	) {}

	private client = HMfull.HMtai;
	private nsfw = new RandomPHUB();
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

	async getAnimePhoto(): Promise<string> {
		const rand = this.toolService.random(0, 2);
		if (rand === 0) return this.client.sfw.neko().url;
		else if (rand === 1) return this.client.nsfw.nsfwMobileWallpaper().url;
		else return this.client.nsfw.uniform().url;
	}

	async getRealPhoto() {
		const rand = this.toolService.random(0, 3);
		if (rand === 0) this.nsfw.getRandomInCategory('aesthetic', 'png').url;
		else if (rand === 1) return this.nsfw.getRandomInCategory('aesthetic', 'jpeg').url;
		else if (rand === 2) return this.nsfw.getRandomInCategory('aesthetic', 'jpg').url;
		else return this.nsfw.getRandomInCategory('aesthetic', 'gif').url;
	}
}
