/* IMPORTS */
const Discord = require("discord.js");
const { MongoClient } = require("mongodb");

/* PARAMETERS */
const client = new Discord.Client();
const uri = "mongodb://192.168.0.100:12702/";
const clientDB = new MongoClient(uri, { useUnifiedTopology: true });

/* CODE */
clientDB.connect().then(err => {
    const database = clientDB.db('Nidhoggbot');
    const config = database.collection('config');
    config.findOne({name: 'Nidhoggbot', type: 'Discord'}).then(conf => { client.login(conf.oauth) });
})

/* EXPORTS */
module.exports.client = client;