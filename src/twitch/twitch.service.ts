import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import * as tmi from "tmi.js";
import {Language as lng} from "../modules/language";

@Injectable()
export class TwitchService {
	constructor() {
		const options = {
			options: {debug: false},
			connection: {
				cluster: `aws`,
				reconnect: true,
			},
			identity: {
				username: `jourloy`,
				password: this.env.TWITCH_KEY,
			},
			channels: this.channels,
		};

		this.client = new tmi.client(options);
		this.client.connect();
		this.run();
	}

	@Cron(`*/1 * * * * *`)
	private checkClient() {
		if (this.client && !this.checked) {
			this.checked = true;
			this.logger.log(`✅ Twitch`);
		}
	}

	private readonly logger = new Logger(TwitchService.name);
	private env = process.env;
	private client: tmi.Client;
	private channels = [`#jourloy`, `#basedtype`];
	private checked = false;

	private banList = {
		translate: [`nightbot`],
	};

	private async run() {
		this.client.on(`message`, async (channel, userstate, message, self) => {
			if (self) return;
			const username = userstate[`username`].toLowerCase();
			const messageSplit = message.split(` `);
			const msSplit = messageSplit[0].split(`!`);
			const command = msSplit[1];

			if (command === `ping`) this.client.say(channel, `I'm here`);

			/**
			 * Translate english to russian
			 */
			if (
				!lng.checkDuplicate(messageSplit) &&
				lng.checkEn(messageSplit) && 
				message.length > 2
			) {
				if (!this.banList.translate.includes(username)) {
					const data = await lng.checkWords(messageSplit);
					if (data.count > 0) this.client.say(channel, data.text);
				}
			}

			if (channel !== `#jourloy`) return;

			this.logger.debug(channel);
			if (command === `ann`) {
				await this.client.say(channel, `/announceblue Это тестовый анонс через костыль :)`);
			}
		});
	}
}
