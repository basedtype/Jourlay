/* IMPORTS */
import * as voice from '@discordjs/voice';
import { Guild } from 'discord.js';
import * as ds from 'discord.js';

/* TYPES */

interface Time {
	seconds?: number;
	minutes?: number;
	hours?: number;
	days?: number;
	weeks?: number;
	mounths?: number;
}

export namespace Config {
	interface Service {
		/**
		 * Name of service
		 * @example param.service = "Binance";
		 */
		service: string;
		/**
		 * For what this API key
		 * @example param.target = "Profile";
		 */
		target: string;
		/**
		 * Auth data. May contain API key or login and password
		 * @example param.auth.api = "thisiscoolapikey";
		 * // OR
		 * param.auth.login = "CoolLogin";
		 * param.auth.password = "SecretPassword";
		 */
		auth: {
			api?: string;
			secret?: string;
			login?: string;
			password?: string;
		};
		/**
		 * Any comment
		 * @example param.description = `This is need for login at binance`
		 */
		description?: string;
	}

	interface User {
		login: string;
		password: string;
		roles: string[];
	}
}

export namespace Binance {
	interface CurrentPeriod {
		bid: {
			startPrice: string;
			prices: PeriodPrice[];
			avgDirection: 'up' | 'down' | 'none';
		};
		ask: {
			startPrice: string;
			prices: PeriodPrice[];
			avgDirection: 'up' | 'down' | 'none';
		};
		amount: number;
		id: number;
	}

	interface PeriodPrice {
		lastPrice: string;
		direction: 'up' | 'down' | 'none';
	}

	interface BookTicker {
		symbol: string;
		/**
		 * Float as string
		 */
		bidPrice: string;
		/**
		 * Float as string
		 */
		bidQty: string;
		/**
		 * Float as string
		 */
		askPrice: string;
		/**
		 * Float as string
		 */
		askQty: string;
	}
}

export namespace Discord {
	interface Warning {
		/**
		 * ID of moderator which send a warning
		 */
		moderator: string;
		/**
		 * Time of warning is seconds. It's automatic param
		 */
		expires: number;
		/**
		 * Reason of warning
		 */
		reason?: string;
	}
}

export namespace Database {
	interface Result {
		err: boolean;
		message?: string;
	}
}

export namespace DiscordMusicType {
	interface Information {
		state: boolean;
		onPause: boolean;
		queue: QueueRequest[];
		nowPlaying: QueueRequest;
		connection: voice.VoiceConnection;
		authorID: string;
		player: voice.AudioPlayer;
		guild: Guild;
		updated: number;
		channelID: string;
		client: ds.Client;
	}

	interface QueueRequest {
		url: string;
		authorID: string;
	}

	interface PlayTypes {
		url: string;
		authorID: string;
		channelID: string;
		channel: ds.VoiceChannel | ds.StageChannel;
		force: boolean;
		client: ds.Client;
	}

	interface PauseTypes {
		channelID: string;
		force?: boolean;
	}

	interface ChangeQueueOwnerTypes {
		ownerID: string;
		nextOwnerID: string;
		force?: boolean;
	}

	interface Return {
		error: boolean;
		errorMessage?: string;
		content?: any;
		contentType?: InstanceType;
	}
}