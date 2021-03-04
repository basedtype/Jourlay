/* IMPORTS */
const { client } = require('./Bots/Jourlay');
const { chillBot } = require('./Bots/ChillBot');
const { tools } = require('../Utils/tools');
const ytdl = require('ytdl-core');
const { MongoClient } = require("mongodb");

/* PARAMS */
const version = 'v1.0';
const voiceLogo = `
╔════════════════════════════════════════════════════════════════════╗
║              ███╗░░░███╗██╗░░░██╗░██████╗██╗░█████╗░               ║
║              ████╗░████║██║░░░██║██╔════╝██║██╔══██╗               ║
║              ██╔████╔██║██║░░░██║╚█████╗░██║██║░░╚═╝               ║
║              ██║╚██╔╝██║██║░░░██║░╚═══██╗██║██║░░██╗               ║
║              ██║░╚═╝░██║╚██████╔╝██████╔╝██║╚█████╔╝               ║
║              ╚═╝░░░░░╚═╝░╚═════╝░╚═════╝░╚═╝░╚════╝░               ║
║                ░█████╗░██╗░░██╗██╗██╗░░░░░██╗░░░░░                 ║
║                ██╔══██╗██║░░██║██║██║░░░░░██║░░░░░                 ║
║                ██║░░╚═╝███████║██║██║░░░░░██║░░░░░                 ║
║                ██║░░██╗██╔══██║██║██║░░░░░██║░░░░░                 ║
║                ╚█████╔╝██║░░██║██║███████╗███████╗                 ║
║                ░╚════╝░╚═╝░░╚═╝╚═╝╚══════╝╚══════╝                 ║
╚═══╣${version}╠═══════════════════════════════════════════════════════════╝`;
let database = null;
let musicCollection = null;
const uri = "mongodb://192.168.0.104:12702/";
const clientDB = new MongoClient(uri);

clientDB.connect().then( err => {
    database = clientDB.db('TwitchBot');
    musicCollection = database.collection('music');
    tools.clear();
    console.log(voiceLogo);;
});

client.on('message', msg => {
    if (msg.author.bot) return;
    const channel = msg.channel;
    const username = msg.author.username.toLowerCase();
    const message = msg.content;

    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];
    if (channel.name === 'music') {
        if (username === 'jourloy') {
            if (command === 'add') {
                msg.delete();
                const url = messageSplit[1];
                const type = messageSplit[2];
                const docs = {
                    url: url,
                    type: type,
                }
                musicCollection.insertOne(docs);
                return;
            } else if (command === 'delete') {
                msg.delete();
                musicCollection.findOneAndDelete({url: messageSplit[1]});
                return;
            }
        }
        if (message[0] !== '!') msg.delete()
    }
});

async function fetched(id, bot) {
    const channel = await bot.channels.fetch(id);
    return channel;
}

async function getChannel(id, bot) {
    let channel = null;
    while (channel == null) {
        channel = await fetched(id, bot);
    }
    return channel;
}

function startMusic() {
    try {
        getChannel('816835066251575337', chillBot).then(channel => {
            channel.join().then(connection => {
                musicCollection.find({type: 'chill'}).toArray((err, queue) => {
                    if (queue == null) {
                        return;
                    }
                    let step = 0
                    let dispatcher = null;
                    dispatcher = connection.play(ytdl(queue[step].url));
                    dispatcher.on('finish', () => {
                        step++;
                        if (step >= queue.length) step = 0;
                        dispatcher = connection.play(ytdl(queue[step].url));
                    });
                    client.on('message', msg => {
                        const channel = msg.channel;
                        const username = msg.author.username.toLowerCase();
                        const message = msg.content;

                        const messageSplit = message.split(' ');
                        const msSplit = messageSplit[0].split('!');
                        const command = msSplit[1];
                        if (channel.name === 'music') {
                            if (command === 'chill') channel.send(`Now playing oh chill channel: ${queue[step].url}`);
                        }
                    })
                });
            })
        })
    } catch {setTimeout(function() {startMusic()}, 10000)}
}

startMusic();