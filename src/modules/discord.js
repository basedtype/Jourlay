const { client } = require("./Bots/Jourlay");

const Discord = require("discord.js");
const { MongoClient } = require("mongodb");
const { Tools, Errors } = require('../Utils/Tools');

let database = null;
let userCollection = null;
let discordCollection = null;

const uri = "mongodb://localhost:27017/";
const clientDB = new MongoClient(uri);
clientDB.connect().then( err => {
    database = clientDB.db('TwitchBot');
    userCollection = database.collection('users');
    discordCollection = database.collection('discord');
});

const CH = {
    'bot': '815257750879600642',
}; // Channels

setInterval(function() {
    if (discordCollection == null) return;
    discordCollection.find({type: 'channel'}).limit(50).toArray((err, channels) => {
        for(let i in channels) {
            if (CH[channels[i].name] == null) {
                client.channels.fetch(channels[i].id).then(channel => {
                    if (channel == null) return;
                    console.log(`Discord => Fetched => ${channels[i].name}`);
                    CH[channels[i].name] = channel;
                })
            }
        }
    })
}, Tools.convertTime({seconds: 1}))

client.on('message', msg => {
    if (msg.author.bot) return;
    const channel = msg.channel;
    const username = msg.author.username.toLowerCase();
    const message = msg.content;

    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];

    const ru_alphabet = 'йцукенгшщзхъфывапролджэёячсмитьбюё';

    for (let i in message) {
        if (ru_alphabet.includes(message[i])) {
            const category = msg.channel.parent.name;
            if (category !== 'Russia') {
                msg.delete();
                return;
            }
        }
    }

    if (channel.name === 'bot') {
        if (command === 'add') {
            const id = messageSplit[1];
            client.channels.fetch(id).then(chn => {
                discordCollection.findOne({id:id}).then(chan => {
                    if (chan == null || chan === []) {
                        const docs = {
                            name: chn.name,
                            id: id,
                            type: 'channel',
                        }
                        discordCollection.insertOne(docs);
                        msg.delete();
                        channel.send(`${chn.name} is added to database`).then(message => {
                            message.delete({timeout:Tools.convertTime({seconds: 10})})
                        });
                    } else {
                        msg.delete();
                        channel.send(`${chn.name} already in database`).then(message => {
                            message.delete({timeout:Tools.convertTime({seconds: 10})})
                        });
                    }
                })
            })
        } else if (command === 'msg') {
            msg.delete();
            console.log(msg);
        } else if (command === 'category') {
            msg.delete();
            console.log(msg.channel.parent);
        } else if (command === 'embed') {
            msg.delete();
            const split = message.split(' | ');
            console.log(split);
            const id = split[1];
            const title = split[2];
            const body = split[3];
            const color = split[4] || 0xff0000;

            const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setDescription(body);

            client.channels.fetch(id).then(chan => {
                if (chan == null) channel.send('This channel is undefind. Your id is correct?').then(message => {
                    message.delete({timeout: Tools.convertTime({seconds: 10})});
                });
                else chan.send(embed);
            })
        } else if (command === 'message') {
            msg.delete();
            const split = message.split(' | ');
            const id = split[1];
            const body = split[2];

            client.channels.fetch(id).then(chan => {
                if (chan == null) channel.send('This channel is undefind. Your id is correct?').then(message => {
                    message.delete({timeout: Tools.convertTime({seconds: 10})});
                });
                else chan.send(`${body}`);
            })
        }
        else msg.delete();
    } else if (channel.name === '🤖│jourlay') {
        msg.delete();
    }
})