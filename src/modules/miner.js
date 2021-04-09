/* IMPORTS */
const { client } = require('./Bots/discord')
const { MongoClient } = require("mongodb");
const Discord = require("discord.js");

/* PARAMS */
const uri = "mongodb://192.168.0.100:12702/";
const clientDB = new MongoClient(uri, { useUnifiedTopology: true });
let guild = null;
let channel = null;

/* CODE */
clientDB.connect().then(err => {
    database = clientDB.db('Wolfbot');
    poolCollection = database.collection('pool');
})

/* INTERVALS */
setInterval(() => {
    if (guild != null) return;

    const guilds = client.guilds.cache.array();
    for (let i in guilds) if (guilds[i].id === '827928792424775740') guild = guilds[i];
}, 1000)

setInterval(() => {
    if (guild == null) return;
    if (channel != null) return;

    const channels = guild.channels.cache.array();
    for (let i in channels) if (channels[i].id === '827928915120619551') channel = channels[i];
}, 1000)

setInterval(() => {
    if (channel == null) return;

    poolCollection.find({}).toArray((err, blocks) => {
        if (blocks.length === 0) return;
        const block = blocks[0];
        let color = null;

        if (block.type === 'Twitch') color = 0xffff00;
        else if (block.type === 'Discord') color = 0x00ff00;
        else color = 0x000000;

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(block.type)
            .setDescription(block.do)
            .setFooter(`Owner: ${block.owner}`)
        channel.send(embed);

        poolCollection.findOneAndDelete({_id: block._id})
    })
}, 1000)