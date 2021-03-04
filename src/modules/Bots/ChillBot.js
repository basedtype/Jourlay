/* IMPORTS */
const Discord = require("discord.js");
const config = require('./config')

/* PARAMS */
const client = new Discord.Client();
client.login(config.chillBot);

/* EXPORTS */
module.exports.chillBot = client;
