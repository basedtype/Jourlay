import {Logger} from "@nestjs/common";
import * as ds from "discord.js";

export class DTools {
	private client: ds.Client;
	private guild: ds.Guild;
	private logger = new Logger(DTools.name);

	constructor(c: ds.Client, g: ds.Guild) {
		this.client = c;
		this.guild = g;
	}

	/**
	 * It deletes a message after a certain amount of time
	 * @param msg - ds.Message - The message you want to delete.
	 * @param {number} time - The time in milliseconds to wait before deleting the message.
	 * @returns A promise that will delete the message after the specified time.
	 */
	public msgDelete(msg: ds.Message, time: number) {
		return setTimeout(async () => {
			if (msg.deletable) {
				await msg.delete();
			}
		}, time);
	}

	/**
	 * It sends a message to a channel.
	 * @param opt
	 * @returns {error: boolean; errorMessage?: string}
	 */
	public async sendInChannel(opt: {
		channelID: string;
		message: string | ds.MessagePayload | ds.MessageOptions;
	}): Promise<{error: boolean; errorMessage?: string}> {
		const channel = await this.client.channels.fetch(opt.channelID);

		if (channel.isText()) {
			channel.send(opt.message);
			return {error: false};
		} else if (channel.isThread()) {
			this.logger.error(`Bot cannot send message in threads`);
			return {error: true, errorMessage: `This is thread`};
		} else if (channel.isVoice()) {
			this.logger.error(`Bot cannot send message in voice`);
			return {error: true, errorMessage: `This is voice channel`};
		}
		this.logger.error(`Unknown type of channel`);
		return {error: true, errorMessage: `Unknown type of channel`};
	}

	/**
	 * It checks if the user is a moderator.
	 * @param {string} userID - The user's ID.
	 * @returns A boolean value.
	 */
	public async isMod(userID: string): Promise<boolean> {
		const userMod = await this.guild.members
			.fetch(userID)
			.then(user =>
				user.roles.cache.find(role => role.id === `799561051905458176`)
			);
		return userMod == null ? false : true;
	}
}
