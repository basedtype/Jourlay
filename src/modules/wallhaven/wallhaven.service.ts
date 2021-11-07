import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import axios from "axios";
import * as _ from 'lodash';

@Injectable()
export class WallhavenService {
    constructor (
		private readonly databaseService: DatabaseService,
	) {}

    private options = {}

	private async getJson(url: string) {
		return await axios.get(url);
	}

	async search(): Promise<any> {
		const url = `https://wallhaven.cc/api/v1/search?categories=010&purity=100&sorting=random`;
		const response = await this.getJson(url);
		if (response) return _.sample(response.data.data);
        else return null;
	}

    async searchNSFW(): Promise<any> {
		const url = `https://wallhaven.cc/api/v1/search?categories=010&purity=010&sorting=random`;
		const response = await this.getJson(url);
		if (response) return _.sample(response.data.data);
        else return null;
	}
}
