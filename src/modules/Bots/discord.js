/* IMPORTS */
const Discord = require("discord.js");
const config = require('./config')

/* PARAMS */
const client = new Discord.Client();
client.login(config.discord);

/* EXPORTS */
module.exports.client = client;
