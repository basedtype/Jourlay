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

client.on('message', msg => {
    if (msg.author.bot) return;
    const channel = msg.channel;

    if (channel.name === 'moderator-only') {
        if (msg.content.startsWith('!test')) discord.noftification('Satisfactory');
    } else if (channel.name === 'bot-create-embed') {
        if (msg.content === '!ex') {
            channel.send('channel id | title | description')
        } else {
            const text = msg.content;
            const textSplited = text.split('|');

            client.channels.fetch(textSplited[0]).then(ch => {
                const embed = new Discord.MessageEmbed()
                .setTitle(textSplited[1])
                .setColor(0xff0000)
                .setDescription(textSplited[2]);
                ch.send(embed);
            });
        }
    } else if (channel.name === 'bot-create-free-game') {
        const text = msg.content;
        if (text === '!ex') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Пример`)
            .setColor(0x00ff00)
            .setDescription(`Игра | Описание | Где | Как забрать | Ссылка | Минимальные характеристики ПК`);
            channel.send(embed);
        } else {
            const textSplited = text.split('|');

            const game = textSplited[0];
            const description = textSplited[1];
            const source = textSplited[2];
            const how = textSplited[3];
            const url = textSplited[4];
            const need = textSplited[5];
            const destChannel = '799554767713206302';

            client.channels.fetch(destChannel).then(ch => {
                if (ch == null) channel.send('ERR_CH_IS_NULL');
                else {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`${game}`)
                    .setColor(0x00ff00)
                    .setURL(url)
                    .setDescription(description)
                    .addFields(
                        { name: 'Где раздается', value: source },
                        { name: 'Что сделать, чтобы получить', value: how},
                        { name: 'Минимальные характеристики', value: need},
                    );
                    ch.send(embed);
                }
            });
        }
    } else if (channel.name === 'bot') {
        const text = msg.content;
        const textSplited = text.split(' ');

        if (textSplited[0] === '!test_mention') {
            const message = `СТРИМ НА КАНАЛЕ | НАЧИНАЕМ С TEST
Привет, @everyone. А у нас тут стрим, давай подрубайся, а то без тебя не начать

Ссылка: https://www.twitch.tv/jourloy`;
            channel.send(message);
        }
    }

    if (msg.content.startsWith('!clear') && msg.author.username === 'JOURLOY') {
        // remove all messages
    }

})

/* CLASSES */

class discord {
    static noftification(game) {
        if (noftification == null) return false;
        const message = `СТРИМ НА КАНАЛЕ | НАЧИНАЕМ С ${game}
Привет, @everyone. А у нас тут стрим, давай подрубайся, а то без тебя не начать

Ссылка: https://www.twitch.tv/jourloy`;
        noftification.send(message)
        return true;
    }
}

module.exports.discord = discord;
module.exports.ds = client;