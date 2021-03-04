/* IMPORTS */
const { client } = require('./Bots/Jourlay');
const { tools } = require('../Utils/tools');

/* PARAMS */
const version = 'v1.0.0';

let logs = [];
const channelsID = {
    noftification: '793404252809986068',
    moderatorOnly: '748407718414385183',
    create: {
        duo: '798853439610159146',
        trio: '799559562909974538',
        squad_4: '799559861285158982',
        squad_5: '799560553525542922',
    }
}
const voiceLogo = `╔════════════════════════════════════════════════════════════════════╗
║ ██╗░░░██╗░█████╗░██╗░█████╗░███████╗                               ║
║ ██║░░░██║██╔══██╗██║██╔══██╗██╔════╝                               ║
║ ╚██╗░██╔╝██║░░██║██║██║░░╚═╝█████╗░░                               ║
║ ░╚████╔╝░██║░░██║██║██║░░██╗██╔══╝░░                               ║
║ ░░╚██╔╝░░╚█████╔╝██║╚█████╔╝███████╗                               ║
║ ░░░╚═╝░░░░╚════╝░╚═╝░╚════╝░╚══════╝                               ║
║ ░█████╗░██╗░░██╗░█████╗░███╗░░██╗███╗░░██╗███████╗██╗░░░░░░██████╗ ║
║ ██╔══██╗██║░░██║██╔══██╗████╗░██║████╗░██║██╔════╝██║░░░░░██╔════╝ ║
║ ██║░░╚═╝███████║███████║██╔██╗██║██╔██╗██║█████╗░░██║░░░░░╚█████╗░ ║
║ ██║░░██╗██╔══██║██╔══██║██║╚████║██║╚████║██╔══╝░░██║░░░░░░╚═══██╗ ║
║ ╚█████╔╝██║░░██║██║░░██║██║░╚███║██║░╚███║███████╗███████╗██████╔╝ ║
║ ░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚══╝╚══════╝╚══════╝╚═════╝░ ║
╚═══╣${version}╠═════════════════════════════════════════════════════════╝`

tools.clear();
console.log(voiceLogo);;

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
