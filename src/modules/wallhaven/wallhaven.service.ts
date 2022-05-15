import {Injectable} from "@nestjs/common";
import axios from "axios";
import * as _ from "lodash";

@Injectable()
export class WallhavenService {
	private options = {};

	private async getJson(url: string) {
		return await axios.get(url);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async search(): Promise<any> {
		const url = `https://wallhaven.cc/api/v1/search?categories=010&purity=010&sorting=random`;
		const response = await this.getJson(url);
		if (response) return _.sample(response.data.data);
		return null;
	}
}
