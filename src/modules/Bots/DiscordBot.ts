/* IMPORTS */
import { manager } from "../database/main";
import { config } from '../../../types';

import * as ds from 'discord.js';

/* CLASSES */
export class discord {
    public static client: ds.Client = null;
    public static _jourloy: config.discordOptions = {role: null, guild: null};

    private static create() {
        manager.configGetBot('Nidhoggbot', 'Discord').then(bot => {
            this.client = new ds.Client();
            this.client.login(bot.oauth);
        })
    }
    
    public static connect(channel: string) {
        this.create();

        const updateInterval = setInterval(() => {
            if (this._jourloy.guild != null) {
                if (this._jourloy.role == null) {
                    const roles = this._jourloy.guild.roles.cache.array();
                    manager.configGetBot('Nidhoggbot', 'Discord').then((bot: config.bot) => {
                        for (let i in roles) if (roles[i].id === bot.roleID) this._jourloy.role = roles[i];
                    })
                } else clearInterval(updateInterval);
            } else {
                if (this.client == null) return;
                const guilds = this.client.guilds.cache.array();
                for (let i in guilds) if (guilds[i].id === channel) this._jourloy.guild = guilds[i];
            }
        })
    }
}