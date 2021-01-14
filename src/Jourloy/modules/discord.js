const Discord = require("discord.js");
const config = require("./conf");

const client = new Discord.Client();
client.login(config.ds_token);

/* PARAMS */

const channelsID = {
    noftification: '793404252809986068',
    moderatorOnly: '748407718414385183',
    create: {
        duo: '798853439610159146',
    }
}
const arrays = {
    channels: [],
}
let noftification = null;

/* FUNCTIONS */

/* INTERVALS */

setInterval(function () {
    client.channels.fetch(channelsID.create.duo).then(channel => {
        if (channel.full == null || channel.full === false) return;

        const parent = channel.parent;
        const guild = channel.guild;
        const name = `DUO`;
        const options = {
            type: 'voice',
            userLimit: 2,
            position: channel.position+1,
            parent: parent,
        }
        
        let user = channel.members.array()[0].user;

        guild.members.fetch(user.id).then(data => {
            user = data.guild.voiceStates.cache.array()[0];
            let idNew = null;

            guild.channels.create(name, options).then(data => {
                idNew = data.id;
                let channelNew = undefined;
                client.channels.fetch(idNew).then(channel => {
                    channelNew = channel;
                    user.setChannel(channelNew);

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

                    repeatCheck(channelNew);
                });
            });
        })
    });
}, 1000);

setInterval(function () {
    if (noftification == null) {
        client.channels.fetch(channelsID.noftification).then(channel => {
            if (channel == null) return;
            noftification = channel;
            console.log('Bot => Discord => Ready');
        });
    }
}, 1000);

/* REACTIONS */

/* CLASSES */

class discord {
    static noftification(game) {
        if (noftification == null) return false;
        const embed = new Discord.MessageEmbed()
        .setTitle(`СТРИМ НА КАНАЛЕ | НАЧИНАЕМ С ${game}`)
        .setColor(0xff0000)
        .setDescription(`Приветик, @everyone. А у нас тут стрим, давай подрубайся. Жми на заголовок, чтобы перейти на канал!`)
        .setURL('https://twitch.tv/jourloy')
        noftification.send(embed)
        return true;
    }
}

module.exports.discord = discord;
module.exports.ds = client;