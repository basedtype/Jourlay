/* IMPORTS */
const { client } = require('../Bots/discord');
const { DBmanager } = require('../DBmanager');
const { tools } = require('./tools');
const { discordLog } = require('./discordTools');
const Discord = require("discord.js");

/* PARAMS */

/* REACTIONS */
client.on('message', msg => {
    if (msg.content === '!nidhoggbot giveaway') {
        DBmanager._giveawayAddChannelInGuild(msg.guild.id, msg.channel.id, msg.author.id);
        discordLog.success(msg.channel, `Channel added in giveaway database`, msg.guild.owner);
    }
})