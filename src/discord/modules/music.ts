/* IMPORTS */
import * as voice from "@discordjs/voice";
import * as play from "play-dl";

/* CLASSES */
export class DiscordMusic {
	private information;
}

/* TYPES */
export namespace DiscordMusic {
	interface Information {
		state: boolean;
		queue: String[];
		connection: voice.VoiceConnection;
		whoStartID: number;
	}
}
