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

    interface log {
        text: string;
        toDiscord: boolean;
        error?: boolean;
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

declare namespace callOfDuty {
    interface mwWeapon {
        muzzle: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        barrel: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        laser: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        optic: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        stock: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        underbarrel: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        ammunition: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        rearGrip: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        perk: {
            exist: boolean;
            count?: number;
            name?: string;
        },
    }

    interface mwWeaponPistol {
        muzzle: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        barrel: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        laser: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        optic: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        triggerAction: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        ammunition: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        rearGrip: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        perk: {
            exist: boolean;
            count?: number;
            name?: string;
        },
    }

    interface mwWeaponSniperRifle {
        muzzle: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        barrel: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        laser: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        optic: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        stock: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        underbarrel: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        rearGrip: {
            exist: boolean;
            count?: number;
            name?: string;
        },
        perk: {
            exist: boolean;
            count?: number;
            name?: string;
        },
    }
}