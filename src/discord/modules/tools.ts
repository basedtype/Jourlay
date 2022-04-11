import * as ds from "discord.js";

export class DTools {
	private client: ds.Client;
	private guild: ds.Guild;

	constructor(c: ds.Client, g: ds.Guild) {
		this.client = c;
		this.guild = g;
	}
}
