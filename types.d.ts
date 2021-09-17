/* IMPORTS */
import * as ds from 'discord.js';

/* TYPES */
declare namespace config {
    interface bot {
        username: string;
        type: string;
        oauth: string;
        roleID?: string;
        secret?: string;
        _oauth?: string;
    }

    interface discordOptions {
        role: ds.Role;
        guild: ds.Guild;
    }

    interface log {
        text: string;
        toDiscord: boolean;
        error?: boolean;
    }

    interface serverConfigs {
        logChannelID: string;
        logs: boolean;
        modChannelID: string;
        updates: boolean;
        conf: boolean;
        creator?: string;
        pays?: boolean;
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