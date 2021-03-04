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
let step = 0;

clientDB.connect().then( err => {
    database = clientDB.db('TwitchBot');
    musicCollection = database.collection('music');
    tools.clear();
    console.log(voiceLogo);;
});

tools.clear();
console.log(voiceLogo);;

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

function play(connection, queue) {
    return connection.play(ytdl(queue[step].url, { filter: 'audioonly' }));
}

function disp(connection) {
    musicCollection.find({type: 'chill'}).toArray((err, queue) => {
        if (queue == null) return;
        const dispatcher = play(connection, queue);
        dispatcher.on('finish', () => {
            step++;
            if (step >= queue.length) step = 0;
            disp(connection, queue);
        });
    })
}

function startMusic() {
    try {
        getChannel('816835066251575337', chillBot).then(channel => {
            channel.join().then(connection => {
                disp(connection);
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
    } catch {setTimeout(function() {startMusic()}, 10000)}
}

startMusic();