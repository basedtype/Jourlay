/* IMPORTS */
const { DBmanager } = require('./DBmanager');
const Discord = require("discord.js");
const moment = require('moment');

/* CLASSES */
class discordLog {
    /**
     * 
     * @param {Discord.Channel} channel 
     * @param {*} string 
     * @returns 
     */
    static error(channel, text) {
        if (channel == null) return false;
        if (text == null) return false;

        const embed = new Discord.MessageEmbed()
        .setColor(0xd25757)
        .setTitle('ERROR')
        .setDescription(text)
        .setFooter(`With ❤️ by Jourloy`)
        channel.send(embed);

        DBmanager._poolAddBlock('Discord', 'NAMVSEYASNO', `Error created: (${text})`)

        return true;
    }
}

/* EXPORTS */
module.exports.discordLog = discordLog;