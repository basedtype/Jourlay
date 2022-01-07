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
				if (ch.members.size < 1) {
					setTimeout(() => {
						if (ch.members.size < 1) this.stopSong();
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
			nowPlaying: '',
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

	/**
	 * Start play a song
	 */
	private static async playSong(url: string) {
		try {
			this.information.nowPlaying = url;
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

	static async play(opt: DiscordMusicType.PlayTypes): Promise<DiscordMusicType.Return> {
		if (this.information.state === false) {
			await this.connectToChannel(opt.channel);
			this.information.authorID = opt.authorID;
			this.information.channelID = opt.channel.id;
			await this.playSong(opt.url);
			return { error: false, content: 'Музыка запущена', contentType: 'string' };
		} else if (opt.channelID === this.information.channelID) {
			this.information.queue.push(opt.url);
			return { error: false, content: 'Музыка добавлена в очередь', contentType: 'string' };
		} else {
			return {
				error: true,
				errorMessage: 'Кажется ты не в том голосовом канале, в котором запущен бот',
			};
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
			return 'Вы не можете управлять очередью';
		}
	}

	static async pause(opt: DiscordMusicType.PauseTypes): Promise<DiscordMusicType.Return> {
		if (this.information.state === false) {
			return { error: true, errorMessage: 'Бот не активен' };
		} else if (this.information.nowPlaying === '') {
			return { error: true, errorMessage: 'Сейчас ничего не играет' };
		} else if (this.information.onPause) {
			return { error: true, errorMessage: 'Музыка уже на паузе' };
		} else if (opt.channelID === this.information.channelID) {
			await this.pauseSong();
			return { error: false, content: 'Музыка поставлена на паузу' };
		} else {
			return {
				error: true,
				errorMessage: 'Кажется ты не в том голосовом канале, в котором запущен бот',
			};
		}
	}

	static async unPause(opt: DiscordMusicType.PauseTypes): Promise<DiscordMusicType.Return> {
		if (this.information.state === false) {
			return { error: true, errorMessage: 'Бот не активен' };
		} else if (this.information.nowPlaying === '') {
			return { error: true, errorMessage: 'Сейчас ничего не играет' };
		} else if (!this.information.onPause) {
			return { error: true, errorMessage: 'Музыка уже снята с паузы' };
		} else if (opt.channelID === this.information.channelID) {
			await this.unPauseSong();
			return { error: false, content: 'Музыка cнята с паузы' };
		} else {
			return {
				error: true,
				errorMessage: 'Кажется ты не в том голосовом канале, в котором запущен бот',
			};
		}
	}

	static async skip(opt: DiscordMusicType.PauseTypes): Promise<DiscordMusicType.Return> {
		if (this.information.state === false) {
			return { error: true, errorMessage: 'Бот не активен' };
		} else if (this.information.queue.length < 1) {
			return { error: true, errorMessage: 'Очередь пуста' };
		} else if (opt.channelID === this.information.channelID) {
			await this.skipSong();
			return { error: false, content: 'Музыка пропущена' };
		} else {
			return {
				error: true,
				errorMessage: 'Кажется ты не в том голосовом канале, в котором запущен бот',
			};
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

		if (this.information.queue.length === 0) {
			return 'Очередь пуста';
		}

		return this.information.queue;
	}

	static async getNowSong(): Promise<DiscordMusicType.Return> {
		if (this.information.state === false) {
			return { error: true, errorMessage: 'Бот не активен' };
		} else if (this.information.nowPlaying === '') {
			return { error: true, errorMessage: 'Сейчас ничего не играет' };
		} else {
			return { error: false, content: this.information.nowPlaying, contentType: 'string' };
		}
	}

	static async changeQueueOwner(
		opt: DiscordMusicType.ChangeQueueOwnerTypes
	): Promise<DiscordMusicType.Return> {
		if (this.information.state === false) {
			return { error: true, errorMessage: 'Бот не активен' };
		} else if (this.information.authorID != opt.ownerID) {
			return { error: true, errorMessage: 'Ты не можешь управлять очередью' };
		} else if (this.information.authorID === opt.nextOwnerID) {
			return { error: true, errorMessage: `<@${opt.nextOwnerID}> уже владеет очередью` };
		} else {
			this.information.authorID = opt.nextOwnerID;
			return { error: false, content: `теперь <@${opt.nextOwnerID}> владеет очередью` };
		}
	}
}
