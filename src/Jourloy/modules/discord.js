const Discord = require("discord.js");
const { Database } = require("../Utils/Database");
const config = require("./conf");

const client = new Discord.Client();
client.login(config.ds_token);

/* PARAMS */

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
let noftification = null;

/* FUNCTIONS */

/* INTERVALS */

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
        const name = `DUO`;
        const options = {
            type: 'voice',
            userLimit: 2,
            position: channel.position+1,
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
        const name = `TRIO`;
        const options = {
            type: 'voice',
            userLimit: 3,
            position: channel.position+1,
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
        const name = `SQUAD`;
        const options = {
            type: 'voice',
            userLimit: 4,
            position: channel.position+1,
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
        const name = `SQUAD`;
        const options = {
            type: 'voice',
            userLimit: 5,
            position: channel.position+1,
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

setInterval(function () {
    if (noftification == null) {
        client.channels.fetch(channelsID.noftification).then(channel => {
            if (channel == null) return;
            noftification = channel;
            console.log('Jourlay => Discord => Ready');
        });
    }
}, 1000);

/* REACTIONS */

client.on('message', msg => {
    if (msg.author.bot) return;
    const channel = msg.channel;
    const username = msg.author.username;

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
    } else if (channel.name === 'bankir-bot-mod') {
        const text = msg.content;
        const textSplited = text.split('|');
        const fractions = textSplited[0];
        const item_name = textSplited[1];
        const level = textSplited[2];
        const lucky = textSplited[3];
        const price = textSplited[4];
        const result = Database.add.item({fractions: fractions, item_name: item_name, level: level, lucky: lucky, price: price});
        if (result === true) channel.send(`${item_name} успешно добавлен`)

    } else if (channel.name === '') {
        const text = msg.content;

        if (text === '!wallet' || text === '!w') {
            const coins = Database.getCoins(username);
            if (coins == null) {
                channel.send(`@${username}, кажется вы не зарегистрированы в нашем банке. Для регистрации напиши сообщение в чат на твиче`);
                return;
            }
            channel.send(`@${username}, у вас на счету ${coins} осколков душ`);
            return;
        } else if (text === '!exp' || text === '!e') {
            const exp = Database.getExp(username);
            channel.send(`@${username}, у вас ${exp.points} очков опыта и ${exp.level} уровень`);
            return;
        } else if (text === '!raid' || text === '!r') {
            if (stopRaid === false || username === 'jourloy') Coins.raid(username, client);
            else client.say(channel, `@${username}, в данный момент ворота из города закрыта, выйти не возможно`);
            return;
        } else if (text === '!top') {
            
        } else if (text === '') {
            
        } else if (text === '') {
            
        }
    } else if (channel.name === 'bot') {
        const text = msg.content;
        const textSplited = text.split(' ');

        if (textSplited[0] === '!t') {
            const game = 'Satisfactory'
            const embed = new Discord.MessageEmbed()
            .setTitle(`СТРИМ НА КАНАЛЕ | ${game}`)
            .setColor(0x00ff00)
            .setDescription('Хей :wave: \nСтример уже в эфире, но что-то тебя не видно в чате, давай подключайся скорее! \n\n**Нажми на заголовок для перехода на канал**')
            .setURL('https://www.twitch.tv/jourloy')
            .setImage('https://i.pinimg.com/564x/63/83/bb/6383bb4b5da0e94ac3a26fa49fb3208e.jpg');
            channel.send('@everyone', { embed: embed })
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
        const embed = new Discord.MessageEmbed()
        .setTitle(`СТРИМ НА КАНАЛЕ | ${game}`)
        .setColor(0x00ff00)
        .setDescription('Хей :wave: \nСтример уже в эфире, но что-то тебя не видно в чате, давай подключайся скорее! \n\n**Нажми на заголовок для перехода на канал**')
        .setURL('https://www.twitch.tv/jourloy')
        .setImage('https://i.pinimg.com/564x/63/83/bb/6383bb4b5da0e94ac3a26fa49fb3208e.jpg');
        noftification.send('@everyone', { embed: embed })
        return true;
    }
}

module.exports.discord = discord;
module.exports.ds = client;