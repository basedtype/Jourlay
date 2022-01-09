import { Injectable } from '@nestjs/common';
import * as fetch from 'request-promise';
import * as HMfull from 'hmfull';
import { ToolsService } from '../../../modules/tools/tools.service';
import { getImage } from 'random-reddit';
import * as _ from 'lodash';

@Injectable()
export class AnimeService {
	constructor(private readonly toolService: ToolsService) {}

	private client = HMfull.HMtai;
	private options = {
		method: 'GET',
		headers: {},
	};

	private async getJson(url: string, options) {
		return JSON.parse(await fetch(url, options));
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

	async getRealPhoto(): Promise<{ url: string; sub: string }> {
		const subreddits = [
			'nsfw',
			'Barelylegal',
			'LegalTeens',
			'collegesluts',
			'collegensfw',
			'GirlswithGlasses',
			'braandpanties',
			'OpenShirt',
			'girlsinhoodies',
			'nopanties',
			'tightdresses',
			'GirlsWearingVS',
			'panties',
			'nsfwoutfits',
			'GirlsinSchoolUniforms',
			'nsfwcosplay',
			'Upskirt',
			'Bathing',
			'wet',
			'AsianHotties',
			'juicyasians',
			'NSFW_Japan',
			'gonewild',
			'asstastic',
			'Sexy',
			'SexyButNotPorn',
			'celebnsfw',
			'suicidegirls',
		];
		const sub = _.sample(subreddits);
		return { url: await getImage(sub), sub: sub };
	}
}
