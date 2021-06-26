/* IMPORTS */
import * as ds from 'discord.js';
import { callOfDuty } from "../../../types";

/* CLASSES */
export class loadout {
    public static getWeapon(name?: string): ds.MessageEmbed | string {
        if (name == null || name === 'weapons') {
            const embed = new ds.MessageEmbed()
            .setTitle('All weapons')
            .addFields(
                {name: "Modern Warfare", value: "**Submachine Guns**\n`!mp5_standart`\n`!mp5_respawn`\n**Marksman Rifles**\n`!kar98k_standart`\n`!kar98k_respawn`\n`!spr`", inline: true},
                {name: "Cold War", value: "**Assault Rifles**\n`!fara`\n**Light Machine Guns**\n`!mg82`\n**Sniper Rifles**\n`!zrg`\n`!k31`", inline: true},
            )
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e);
            return embed;
        } else if (name === 'kar98k_standart' || name === 'kar98k' || name === 'kar') {
            const embed = new ds.MessageEmbed()
            .setTitle('Kar98k (Standart)')
            .addFields(
                {name: "Muzzle", value: "Monolithic Supperssor (5)"},
                {name: "Barrel", value: "Singuard Customs 27.6\" (3)"},
                {name: "Laser", value: "Tac Laser (1)"},
                {name: "Optic", value: "Sniper Scrope (8)"},
                {name: "Stock", value: "FTAC Sport Comb (3)"},
                {name: "Underbarrel", value: "-"},
                {name: "Rear Grip", value: "-"},
                {name: "Perk", value: "-"},
            )
            .setImage('https://cdn.discordapp.com/attachments/820292600334516294/855853337466241024/Kar98k_standart.png')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("MW · Marksman Rifles");
            return embed;
        } else if (name === 'kar98k_respawn') {
            const embed = new ds.MessageEmbed()
            .setTitle('Kar98k (Respawn)')
            .addFields(
                {name: "Muzzle", value: "Monolithic Supperssor (5)"},
                {name: "Barrel", value: "-"},
                {name: "Laser", value: "Tac Laser (1)"},
                {name: "Optic", value: "Scout Combat Optic (4)"},
                {name: "Stock", value: "FTAC Sport Comb (3)"},
                {name: "Underbarrel", value: "-"},
                {name: "Rear Grip", value: "-"},
                {name: "Perk", value: "Fully Loaded (5)"},
            )
            .setImage('https://cdn.discordapp.com/attachments/820292600334516294/855902178995339304/kar98k_respawn.png')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("MW · Marksman Rifles");
            return embed;
        } else if (name === 'mp5_standart' || name === 'mp5') {
            const embed = new ds.MessageEmbed()
            .setTitle('MP5 (Standart)')
            .addFields(
                {name: "Muzzle", value: "-"},
                {name: "Barrel", value: "Monolithic Integral Suppressor (2)"},
                {name: "Laser", value: "Tac Laser (3)"},
                {name: "Optic", value: "-"},
                {name: "Stock", value: "-"},
                {name: "Underbarrel", value: "Merc Foregrip (2)"},
                {name: "Ammunition", value: "45 Round Mags (1)"},
                {name: "Rear Grip", value: "Rubberized Grip Tape (1)"},
                {name: "Perk", value: "="},
            )
            .setImage('https://media.discordapp.net/attachments/820292600334516294/855903327061540884/mp5_standart.png?width=1886&height=1061')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("MW · Submachine Guns");
            return embed;
        } else if (name === 'mp5_respawn') {
            const embed = new ds.MessageEmbed()
            .setTitle('MP5 (Respawn)')
            .addFields(
                {name: "Muzzle", value: "-"},
                {name: "Barrel", value: "Monolithic Integral Suppressor (2)"},
                {name: "Laser", value: "Tac Laser (3)"},
                {name: "Optic", value: "-"},
                {name: "Stock", value: "FTAC Collapsible (4)"},
                {name: "Underbarrel", value: "-"},
                {name: "Ammunition", value: "45 Round Mags (1)"},
                {name: "Rear Grip", value: "-"},
                {name: "Perk", value: "Fully Loaded (7)"},
            )
            .setImage('')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("MW · Submachine Guns");
            return embed;
        } else if (name === 'mg82') {
            const embed = new ds.MessageEmbed()
            .setTitle('MG 82')
            .addFields(
                {name: "Muzzle", value: "Agency Suppressor (6)"},
                {name: "Barrel", value: "16.4\" Task Force (6)"},
                {name: "Laser", value: "-"},
                {name: "Optic", value: "Axial Arms 3x (2)"},
                {name: "Stock", value: "-"},
                {name: "Underbarrel", value: "Field Agent Grip (5)"},
                {name: "Ammunition", value: "-"},
                {name: "Rear Grip", value: "Serpren Wrap (5)"},
            )
            .setImage('https://cdn.discordapp.com/attachments/820292600334516294/855903882630529054/mg82.png')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("CW · Light Machine Guns");
            return embed;
        } else if (name === 'zrg') {
            const embed = new ds.MessageEmbed()
            .setTitle('ZRG')
            .addFields(
                {name: "Muzzle", value: "Sound Moderator (3)"},
                {name: "Barrel", value: "43.9\" Combat Recon (4)"},
                {name: "Laser", value: "SWAT 5mw Laser Sight (4)"},
                {name: "Optic", value: "-"},
                {name: "Stock", value: "-"},
                {name: "Underbarrel", value: "-"},
                {name: "Ammunition", value: "5 Rnd (1)"},
                {name: "Rear Grip", value: "SASR Jungle Grip (5)"},
            )
            .setImage('https://cdn.discordapp.com/attachments/820292600334516294/855904147063832606/zrg.png')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("CW · Sniper Rifles");
            return embed;
        } else if (name === 'fara') {
            const embed = new ds.MessageEmbed()
            .setTitle('Fara')
            .addFields(
                {name: "Muzzle", value: "Suppressor (3)"},
                {name: "Barrel", value: "18.7\" Spetsnaz RPK Barrel (6)"},
                {name: "Laser", value: "-"},
                {name: "Optic", value: "Axial Arms 3x (5)"},
                {name: "Stock", value: "-"},
                {name: "Underbarrel", value: "Patrol Grip (5)"},
                {name: "Ammunition", value: "VDV 60 Rnd Fast Mag (6)"},
                {name: "Rear Grip", value: "-"},
            )
            .setImage('https://cdn.discordapp.com/attachments/820292600334516294/857093765176098816/fara.png')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("CW · Assault Rifles");
            return embed;
        } else if (name === 'spr') {
            const embed = new ds.MessageEmbed()
            .setTitle('SP-R 208')
            .addFields(
                {name: "Muzzle", value: "Monolithic Suppressor (7)"},
                {name: "Barrel", value: "SP-R 26\" (3)"},
                {name: "Laser", value: "Tac Laser (1)"},
                {name: "Optic", value: "Solozero SP-R 28mm (10)"},
                {name: "Stock", value: "-"},
                {name: "Underbarrel", value: "-"},
                {name: "Ammunition", value: ".300 Norma Mag 5-R Mags (2)"},
                {name: "Bolt Assembly", value: "-"},
                {name: "Perk", value: "-"},
            )
            .setImage('https://cdn.discordapp.com/attachments/820292600334516294/857093765176098816/fara.png')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("MW · Marksman Rifles");
            return embed;
        } else if (name === 'k31') {
            const embed = new ds.MessageEmbed()
            .setTitle('Swiss k31')
            .addFields(
                {name: "Muzzle", value: "GRU Suppressor (6)"},
                {name: "Barrel", value: "24.9\" Combat Recon (4)"},
                {name: "Laser", value: "SWAT 5mw Laser Sight (4)"},
                {name: "Optic", value: "-"},
                {name: "Stock", value: "SAS Combat Stock (5)"},
                {name: "Underbarrel", value: "-"},
                {name: "Ammunition", value: "-"},
                {name: "Rear Grip", value: "Serpent Grip (5)"},
            )
            .setImage('https://cdn.discordapp.com/attachments/820292600334516294/857097965198245928/k31.png')
            .setFooter('With ❤️ by Jourloy')
            .setColor(0xfe645e)
            .setAuthor("CW · Sniper Rifles");
            return embed;
        }
        return 'This weapon undefined';
    }
}