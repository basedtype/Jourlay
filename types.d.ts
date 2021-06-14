/* IMPORTS */
import * as ds from 'discord.js';

/* TYPES */
declare namespace config {
    interface bot {
        username: string;
        type: string;
        oauth: string;
        roleID?: string;
    }

    interface discordOptions {
        role: ds.Role;
        guild: ds.Guild;
    }
}

declare namespace toolsOptions {
    interface time {
        seconds?: number;
        minutes?: number;
        hours?: number;
        days?: number;
        weeks?: number;
        mounths?: number;
    }
}