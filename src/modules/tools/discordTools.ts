/* IMPORTS */
const { tools } = require('./tools');

import { manager as database } from "../Database";
import * as Discord from "discord.js";
import * as moment from "moment";

import * as express from "express";

/* CLASSES */
class discordLog {
    /**
     * @param channel 
     * @param text 
     * @param owner
     */
    static error(channel: Discord.TextChannel, text: string, owner: string): boolean {
        const embed = new Discord.MessageEmbed()
        .setColor(0xd25757)
        .setTitle('ERROR')
        .setDescription(text)
        .setFooter(`With ❤️ by Jourloy`)
        channel.send(embed);

        database.poolAddBlock('Discord', owner, `Error: (${text})`)

        return true;
    }

    /**
     * 
     * @param channel 
     * @param text 
     * @param owner
     */
     static success(channel: Discord.TextChannel, text: string, owner: string) {
        const embed = new Discord.MessageEmbed()
        .setColor(0xd25757)
        .setTitle('Success')
        .setDescription(text)
        .setFooter(`With ❤️ by Jourloy`)
        channel.send(embed);

        database.poolAddBlock('Discord', owner, `Success: (${text})`)

        return true;
    }
}

class discordTools {
    static createGiveaway(give: giveaways.give, response: express.Response) {
        const { client } = require('../Bots/discord');
        database.configGetGuild(give.guildID).then(guildDB => {
            if (guildDB == null || guildDB.giveaways == null) {
                response.json('Access denied');
                return;
            }
            client.guilds.fetch(give.guildID).then(guild => {
                if (guild == null) {
                    response.json('Access denied');
                    return;
                }

                let time = give.time;
                let amount = give.amount;
                const title = give.title;
                const urlTitle = give.urlTitle || '';
                const urlImage = give.urlImage || '';
                let timeSplit = time.split(':');
                const days = timeSplit[0] || 0;
                const hours = timeSplit[1] || 0;
                const minutes = timeSplit[2] || 0;
                const seconds = timeSplit[3] || 0;
                let msTime = tools.convertTime({days: days, hours: hours, minutes: minutes, seconds: seconds})
                msTime = Math.floor(msTime / 1000)

                const formatted = `${days} days ${hours} hours ${minutes} minutes`;

                if (amount <= 0) amount = 1;

                const embed = new Discord.MessageEmbed()
                    .setTitle(title)
                    .setDescription(`Жми на 🎁 для участия`)
                    .addField('Осталось до конца:', formatted, true)
                    .addField('Победителей:', amount, true)
                    .setColor(0xd25757)
                    .setImage(urlImage)
                    .setURL(urlTitle)
                    .setFooter(`With ❤️ by Jourloy`)
                client.channels.fetch(guildDB.giveaways.channelID).then(channel => {
                    channel.send(`<@822198199140745246>`, { embed: embed }).then(mss => {
                        const give: giveaways.give = {
                            msgID: mss.id,
                            amount: amount,
                            length: msTime,
                            end: Math.floor(moment.now() / 1000) + msTime,
                            created: Math.floor(moment.now() / 1000),
                            people: [],
                            urlTitle: urlTitle,
                            urlImage: urlImage,
                            title: title,
                        }
                        database.giveawaysAdd(guild.id, give);
                        mss.react('🎁')
                        database.poolAddBlock('Discord', guild.owner, `Giveaway create via website`)
                    });
                })
            })
        })
    }
}
/* EXPORTS */
module.exports.discordLog = discordLog;
module.exports.discordTools = discordTools;