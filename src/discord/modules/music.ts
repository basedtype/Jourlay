/* IMPORTS */
import { DiscordMusicType } from 'types';

import * as voice from '@discordjs/voice';
import * as ds from 'discord.js';
import * as play from 'play-dl';
import { Cron } from '@nestjs/schedule';

/* CLASSES */
export class DiscordMusic {
	public static information: DiscordMusicType.Information = null;

	/**
	 * Check amount users in voice channel
	 */
	@Cron('* */1 * * * *')
	private static async checkMusicChannel() {
		if (this.information.channelID === '') return;

		this.information.guild.channels
			.fetch(this.information.channelID)
			.then((ch: ds.VoiceChannel) => {
				if (ch.members.size <= 1) {
					setTimeout(() => {
						if (ch.members.size <= 1) this.stopSong();
					}, 1000 * 60 * 5);
				}
			});
	}

	/**
	 * Initialization music class
	 */
	public static async init(guild: ds.Guild) {
		this.information = {
			state: false,
			onPause: false,
			queue: [],
			authorID: '',
			connection: null,
			player: voice.createAudioPlayer(),
			guild: guild,
			updated: Date.now(),
			channelID: '',
		};

		this.handler();
	}

	/**
	 * Connectig to channel and create connection
	 */
	private static async connectToChannel(channel: ds.VoiceChannel | ds.StageChannel) {
		const connection = voice.joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: this.information.guild.voiceAdapterCreator,
		});
		try {
			await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 30e3);
			this.information.connection = connection;
			this.information.channelID = channel.id;
		} catch (error) {
			connection.destroy();
			console.log(error); // TODO: To logger
		}
	}

	/**
	 * Start timeout on state change
	 */
	private static handler() {
		this.information.player.on('stateChange', (oldState, newState) => {
			if (this.information.state === false) return;
			if (this.information.onPause === true) return;

			if (
				newState.status === voice.AudioPlayerStatus.Idle &&
				this.information.queue.length === 0
			) {
				const now = Date.now();
				setTimeout(() => {
					if (now >= this.information.updated) {
						this.information.connection.disconnect();
						this.init(this.information.guild);
					}
				}, 1000 * 60 * 5);
			}

			if (
				newState.status === voice.AudioPlayerStatus.Idle &&
				this.information.queue.length > 0
			) {
				this.information.player.stop(true);
				const url = this.information.queue.shift();
				//@ts-ignore
				this.playSong(url);
			}
		});
	}

	private static async playSong(url: string) {
		try {
			const stream = await play.stream(url);
			const resource = voice.createAudioResource(stream.stream, {
				inputType: stream.type,
			});
			this.information.player.play(resource);
			this.information.connection.subscribe(this.information.player);

			this.information.state = true;
			this.information.updated = Date.now();

			return voice.entersState(this.information.player, voice.AudioPlayerStatus.Playing, 5e3);
		} catch (err) {
			console.log(err);
		}
	}

	private static async stopSong() {
		this.information.player.stop(true);
		this.information.connection.subscribe(this.information.player);
		this.information.connection.disconnect();

		this.init(this.information.guild);
	}

	private static async pauseSong() {
		this.information.player.pause(true);
		this.information.connection.subscribe(this.information.player);

		this.information.onPause = true;
		this.information.updated = Date.now();
	}

	private static async unPauseSong() {
		this.information.player.unpause();
		this.information.connection.subscribe(this.information.player);

		this.information.onPause = false;
		this.information.updated = Date.now();
	}

	private static async skipSong() {
		this.information.player.stop(true);
		const url = this.information.queue.shift();
		//@ts-ignore
		await this.playSong(url);
	}

	static async play(
		url: string,
		authorID: string,
		channel: ds.VoiceChannel | ds.StageChannel,
		force: boolean
	): Promise<string> {
		if (this.information.state === false) {
			await this.connectToChannel(channel);
			this.information.authorID = authorID;
			await this.playSong(url);
			return 'Музыка включена';
		} else {
			this.information.queue.push(url);
			return 'Музыка добавлена в очередь';
		}

		if (this.information.authorID !== authorID) {
			return 'Вы не можете управлять музыкой';
		}
	}

	static async stop(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.authorID === authorID || force) {
			await this.stopSong();
			return 'Музыка остановлена, очередь очищена';
		}

		if (this.information.authorID !== authorID) {
			return 'Вы не можете управлять музыкой';
		}
	}

	static async pause(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.onPause === false) {
			await this.pauseSong();
			return 'Музыка поставлена на паузу';
		} else {
			return 'Музыка не может быть поставлена на паузу, так как она уже на ней';
		}

		if (this.information.authorID !== authorID) {
			return 'Вы не можете управлять музыкой';
		}
	}

	static async unPause(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.onPause === true) {
			await this.unPauseSong();
			return 'Музыка снята с паузы';
		} else {
			return 'Музыка не может быть снята с паузы, так как она уже не на ней';
		}

		if (this.information.authorID !== authorID) {
			return 'Вы не можете управлять музыкой';
		}
	}

	static async skip(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.queue.length > 0) {
			await this.skipSong();
			return 'Музыка пропущена';
		} else {
			return 'Очередь пуста';
		}

		if (this.information.authorID !== authorID) {
			return 'Вы не можете управлять музыкой';
		}
	}

	static async clearQueue(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.authorID === authorID || force) {
			this.information.queue = [];
			return 'Очередь сброшена';
		}

		if (this.information.authorID !== authorID) {
			return 'Вы не можете управлять музыкой';
		}
	}

	static async getQueue() {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		return this.information.queue;
	}
}
