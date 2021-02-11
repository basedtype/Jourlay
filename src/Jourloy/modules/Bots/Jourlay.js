/* IMPORTS */
const Discord = require("discord.js");
const config = require('../conf')

/* PARAMS */
const client = new Discord.Client();
client.login(config.ds_token);

/* EXPORTS */
module.exports.client = client;
