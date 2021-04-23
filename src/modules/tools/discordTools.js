/* IMPORTS */
const { DBmanager } = require('../DBmanager');
const Discord = require("discord.js");
const moment = require('moment');
const { tools } = require('./tools');

/* CLASSES */
class discordLog {
    /**
     * 
     * @param {Discord.Channel} channel 
     * @param {string} text 
     * @param {string} owner
     * @returns 
     */
    static error(channel, text, owner) {
        if (channel == null) return false;
        if (text == null) return false;

        const embed = new Discord.MessageEmbed()
        .setColor(0xd25757)
        .setTitle('ERROR')
        .setDescription(text)
        .setFooter(`With ❤️ by Jourloy`)
        channel.send(embed);

        DBmanager._poolAddBlock('Discord', owner, `Error: (${text})`)

        return true;
    }

    /**
     * 
     * @param {Discord.Channel} channel 
     * @param {string} text 
     * @param {string} owner
     * @returns 
     */
     static success(channel, text, owner) {
        if (channel == null) return false;
        if (text == null) return false;

        const embed = new Discord.MessageEmbed()
        .setColor(0xd25757)
        .setTitle('Success')
        .setDescription(text)
        .setFooter(`With ❤️ by Jourloy`)
        channel.send(embed);

        DBmanager._poolAddBlock('Discord', owner, `Success: (${text})`)

        return true;
    }
}

class discordTools {
    static createGiveaway(give, response) {
        const { client } = require('../Bots/discord');
        DBmanager._configGetGuild(give.guildID).then(guildDB => {
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
                time = time.split(':');
                const days = time[0] || 0;
                const hours = time[1] || 0;
                const minutes = time[2] || 0;
                const seconds = time[3] || 0;
                let msTime = tools.convertTime({days: days, hours: hours, minutes: minutes, seconds: seconds})
                msTime = Math.floor(msTime / 1000)

                const formatted = `${days} days ${hours} hours ${minutes} minutes`;

                if (amount === '' || amount === []) amount = 1;
                amount = parseInt(amount);

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
                        const give = {
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
                        DBmanager._giveawayAdd(guild.id, give);
                        mss.react('🎁')
                        DBmanager._poolAddBlock('Discord', guild.owner, `Giveaway create via website`)
                    });
                })
            })
        })
    }
}

/* EXPORTS */
module.exports.discordLog = discordLog;
module.exports.discordTools = discordTools;