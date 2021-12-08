/* IMPORTS */
import { DiscordMusicType } from 'types';

import * as voice from '@discordjs/voice';
import * as ds from 'discord.js';
import * as play from 'play-dl';

/* CLASSES */
export class DiscordMusic {
	private static information: DiscordMusicType.Information = null;

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
		}

		this.handler();
	}

	private static async connectToChannel(channel: ds.VoiceChannel | ds.StageChannel) {
		const connection = voice.joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: this.information.guild.voiceAdapterCreator,
		});
		try {
			await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 30e3);
			this.information.connection = connection;
		} catch (error) {
			connection.destroy();
			console.log(error); // TODO: To logger
		}
	}

	private static handler() {
		this.information.player.on('stateChange', (oldState, newState) => {
			if (this.information.state === false) return;
			if (this.information.onPause === true) return;

			if (this.information.queue.length === 0) {
				const now = Date.now();
				setTimeout(() => {
					if (now >= this.information.updated) this.stopSong();
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
		force: boolean,
	): Promise<string> {
		if (this.information.state === false) {
			await this.connectToChannel(channel);
			this.information.authorID = authorID;
			await this.playSong(url);
			return 'Музыка включена';
		} else if (this.information.authorID === authorID || force) {
			this.information.queue.push(url);
			return 'Музыка добавлена в очередь';
		} else {
			return 'Вы не можете управлять музыкой, так как ее запустил кто-то другой';
		}
	}

	static async stop(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.authorID === authorID || force) {
			await this.stopSong();
			return 'Музыка остановлена, очередь очищена';
		} else {
			return 'Музыка не может быть остановлена, так как ее запустили не вы';
		}
	}

	static async pause(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.authorID === authorID || force) {
			if (this.information.onPause === false) {
				await this.pauseSong();
				return 'Музыка поставлена на паузу';
			} else {
				return 'Музыка не может быть поставлена на паузу, так как она уже на ней';
			}
		} else {
			return 'Музыка не может быть поставлена на паузу, так как ее запустили не вы';
		}
	}

	static async unPause(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.authorID === authorID || force) {
			if (this.information.onPause === true) {
				await this.unPauseSong();
				return 'Музыка снята с паузы';
			} else {
				return 'Музыка не может быть снята с паузы, так как она уже не на ней';
			}
		} else {
			return 'Музыка не может быть снята с паузы, так как ее запустили не вы';
		}
	}

	static async skip(authorID: string, force: boolean): Promise<string> {
		if (this.information.state === false) {
			return 'Музыка не активна';
		}

		if (this.information.authorID === authorID || force) {
			if (this.information.queue.length > 0) {
				await this.skipSong();
				return 'Музыка пропущена';
			} else {
				return 'Очередь пуста';
			}
		}

		if (this.information.authorID !== authorID) {
			return 'Вы не можете управлять музыкой';
		}
	}
}
