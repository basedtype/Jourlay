/* IMPORTS */
import { manager } from "../database/main";
import { config } from '../../../types';
import { tools } from "../tools/main";

import * as ds from 'discord.js';

/* CLASSES */
export class discord {
    public static client: ds.Client = null;
    public static _guild: ds.Guild = null;

    public static async init() {
        const bot: config.bot = await manager.configGetBot('Nidhoggbot', 'Discord');
        this.client = new ds.Client({ intents: [ds.Intents.FLAGS.GUILDS, ds.Intents.FLAGS.GUILD_BANS, ds.Intents.FLAGS.GUILD_MESSAGES, ds.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, ds.Intents.FLAGS.GUILD_PRESENCES, ds.Intents.FLAGS.GUILD_VOICE_STATES, ds.Intents.FLAGS.GUILD_INVITES, ds.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, ds.Intents.FLAGS.DIRECT_MESSAGES, ds.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
        await this.client.login(bot.oauth);
        this.getInformation();
    }

    private static async getInformation() {
        if (this.client == null) tools.createError('Client doesn\'n exist');
        this._guild = this.client.guilds.cache.find(guild => guild.id === '437601028662231040');
    }
}