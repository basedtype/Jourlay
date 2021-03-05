/* IMPORTS */
const { client } = require('./Bots/Jourlay');
const { tools } = require('../Utils/tools');
const { MongoClient } = require("mongodb");
const ytdl = require('ytdl-core');

/* PARAMS */
const version = 'v1.5';
const voiceLogo = `╔════════════════════════════════════════════════════════════════════╗
║                ██╗░░░██╗░█████╗░██╗░█████╗░███████╗                ║
║                ██║░░░██║██╔══██╗██║██╔══██╗██╔════╝                ║
║                ╚██╗░██╔╝██║░░██║██║██║░░╚═╝█████╗░░                ║
║                ░╚████╔╝░██║░░██║██║██║░░██╗██╔══╝░░                ║
║                ░░╚██╔╝░░╚█████╔╝██║╚█████╔╝███████╗                ║
║                ░░░╚═╝░░░░╚════╝░╚═╝░╚════╝░╚══════╝                ║
║ ░█████╗░██╗░░██╗░█████╗░███╗░░██╗███╗░░██╗███████╗██╗░░░░░░██████╗ ║
║ ██╔══██╗██║░░██║██╔══██╗████╗░██║████╗░██║██╔════╝██║░░░░░██╔════╝ ║
║ ██║░░╚═╝███████║███████║██╔██╗██║██╔██╗██║█████╗░░██║░░░░░╚█████╗░ ║
║ ██║░░██╗██╔══██║██╔══██║██║╚████║██║╚████║██╔══╝░░██║░░░░░░╚═══██╗ ║
║ ╚█████╔╝██║░░██║██║░░██║██║░╚███║██║░╚███║███████╗███████╗██████╔╝ ║
║ ░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚══╝╚══════╝╚══════╝╚═════╝░ ║
╚═══╣${version}╠═══════════════════════════════════════════════════════════╝`;
const channelsID = {
    noftification: '793404252809986068',
    moderatorOnly: '748407718414385183',
    create: {
        duo: '798853439610159146',
        trio: '799559562909974538',
        squad_4: '799559861285158982',
        squad_5: '799560553525542922',
    },
}
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

setInterval(function () {
    const deleteFunc = (channelNew) => {
        if (channelNew.members.array().length === 0) {
            channelNew.delete();
            return true;
        }
        return false;
    }

    const repeatCheck = function(channelNew) {
        setTimeout(function() {deleteChannel(channelNew)}, 1000*1);
    }

    const deleteChannel = function(channelNew) {
        if (deleteFunc(channelNew) === false) repeatCheck(channelNew);
    };

    client.channels.fetch(channelsID.create.duo).then(channel => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = `👥│DUO`;
        const options = {
            type: 'voice',
            userLimit: 2,
            position: 4,
            parent: parent,
        }
        
        let user = channel.members.array()[0].user;

        guild.members.fetch(user.id).then(data => {

            for (let i in data.guild.voiceStates.cache.array()) {
                if (user.id === data.guild.voiceStates.cache.array()[i].id) user = data.guild.voiceStates.cache.array()[i];
            }
            let idNew = null;

            guild.channels.create(name, options).then(data => {
                idNew = data.id;
                let channelNew = undefined;
                client.channels.fetch(idNew).then(channel => {
                    channelNew = channel;
                    user.setChannel(channelNew);
                    repeatCheck(channelNew);
                });
            });
        })
    });

    client.channels.fetch(channelsID.create.trio).then(channel => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = `👥│TRIO`;
        const options = {
            type: 'voice',
            userLimit: 3,
            position: 4,
            parent: parent,
        }
        
        let user = channel.members.array()[0].user;

        guild.members.fetch(user.id).then(data => {

            for (let i in data.guild.voiceStates.cache.array()) {
                if (user.id === data.guild.voiceStates.cache.array()[i].id) user = data.guild.voiceStates.cache.array()[i];
            }
            let idNew = null;

            guild.channels.create(name, options).then(data => {
                idNew = data.id;
                let channelNew = undefined;
                client.channels.fetch(idNew).then(channel => {
                    channelNew = channel;
                    user.setChannel(channelNew);
                    repeatCheck(channelNew);
                });
            });
        })
    });

    client.channels.fetch(channelsID.create.squad_4).then(channel => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = `👥│SQUAD`;
        const options = {
            type: 'voice',
            userLimit: 4,
            position: 4,
            parent: parent,
        }
        
        let user = channel.members.array()[0].user;

        guild.members.fetch(user.id).then(data => {

            for (let i in data.guild.voiceStates.cache.array()) {
                if (user.id === data.guild.voiceStates.cache.array()[i].id) user = data.guild.voiceStates.cache.array()[i];
            }
            let idNew = null;

            guild.channels.create(name, options).then(data => {
                idNew = data.id;
                let channelNew = undefined;
                client.channels.fetch(idNew).then(channel => {
                    channelNew = channel;
                    user.setChannel(channelNew);
                    repeatCheck(channelNew);
                });
            });
        })
    });

    client.channels.fetch(channelsID.create.squad_5).then(channel => {
        if (channel == null || channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = `👥│SQUAD`;
        const options = {
            type: 'voice',
            userLimit: 5,
            position: 4,
            parent: parent,
        }
        
        let user = channel.members.array()[0].user;

        guild.members.fetch(user.id).then(data => {

            for (let i in data.guild.voiceStates.cache.array()) {
                if (user.id === data.guild.voiceStates.cache.array()[i].id) user = data.guild.voiceStates.cache.array()[i];
            }
            let idNew = null;

            guild.channels.create(name, options).then(data => {
                idNew = data.id;
                let channelNew = undefined;
                client.channels.fetch(idNew).then(channel => {
                    channelNew = channel;
                    user.setChannel(channelNew);
                    repeatCheck(channelNew);
                });
            });
        })
    });
}, 1000);

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
            disp(connection);
        });
    })
}

function startMusic() {
    try {
        getChannel('816835066251575337', client).then(channel => {
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
                        if (command === 'music') channel.send(`Now playing: ${queue[step].url}`);
                    }
                })
            });
        })
    } catch {setTimeout(function() {startMusic()}, 10000)}
}

startMusic();

client.on('message', msg => {
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
            } else if (command === 'delete') {
                msg.delete();
                const url = messageSplit[1];
                musicCollection.findOneAndDelete({url: url});
            }
        }
    }
})