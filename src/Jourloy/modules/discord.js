const { client } = require("./Bots/Jourlay");

const Discord = require("discord.js");
const { Database } = require("../Utils/Database");
const { DiscordGame } = require('../Game/Game');
const { tools, errors } = require('../Utils/Tools');

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
            console.log('Discord => Jourlay => Ready');
        });
    }
}, 1000);

/* FUNCTIONS */
function channelRaids(information) {
    const channel = information.channel;
    const username = information.username;
    const message = information.message;
    const split = message.split(' ');

    if (split[0] === '!raid') {

        console.log(username);
        const game = DiscordGame.toRaid(username, channel);
        if (game === errors.ERR_NOT_FIND_USER) channel.send(`@${username}, I can'n find you in my database. You need choose fraction by this command: !fraction`);
        else if (game === errors.ERR_USER_NOT_IN_FRACTION) channel.send(`@JOURLOY, user [${username}] have data error (fraction error)`);
        else if (game === errors.ERR_ALREADY_IN_RAID) channel.send(`@${username}, you are in a raid. You can check time by this command: !status`);
        else if (game === errors.ERR_NOT_ENOUGH_SHARDS) channel.send(`@${username}, you are not have enough money for raid`);

    } else if (split[0] === '!status') {

        const raid = Database.get.raid(username);
        if (raid.inRaid === true) {
            const now = Math.floor(moment.now() / 1000);
            const created_at = raid.raid.created;
            const time = raid.raid.time;

            let about = Math.floor((created_at + time) - now);
            let hours = Math.floor(about/60/60);
            let minutes = Math.floor(about/60)-(hours*60);
            let seconds = about%60

            const formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');

            channel.send(`@${username}, you are in raid. You will come back in ${formatted}`);
        } else channel.send(`@${username}, you are ready to go in raid. Use this command: !raid`);

    } else if (split[0] === '!wallet') {

        const raid = Database.get.raid(username);
        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (raid.inRaid === true) {
            channel.send(`@${username}, you are in raid`)
        }
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') channel.send(`@${username}, I can'n find you in my database. You need choose fraction by this command: !fraction`);
        else {
            if (game.fraction === 'C') channel.send(`@${username}, on your bill ${hero.wallet} купюр`);
            else if (game.fraction === 'V') channel.send(`@${username}, on your bill ${hero.wallet} gold coins`);
            else if (game.fraction === 'J') channel.send(`@${username}, on your bill ${hero.wallet} Great steel ignots`);
            else if (game.fraction === 'K') channel.send(`@${username}, on your bill ${hero.wallet} soul shards`);

        }

    } else if (split[0] === '!xp') {

        const hero = Database.get.hero(username);
        const game = Database.get.game(username);
        if (hero === errors.ERR_NOT_FIND_USER || game.fraction === '') channel.send(`@${username}, I can'n find you in my database. You need choose fraction by this command: !fraction`);
        else channel.send(`@${username}, you are have ${hero.level} level and ${hero.xp} experience points`);

    } else if (split[0] === '!fraction') {

        const game = Database.get.game(username);
        if (game === errors.ERR_NOT_FIND_USER || game.fraction === '') {
            if (messageSplit[1] == null || (messageSplit[1] !== 'V' && messageSplit[1] !== 'J' && messageSplit[1] !== 'C' && (messageSplit[1] !== 'K' && username !== 'jourloy'))) channel.send(`@${username}, after !fraction you should write you fraction symbol`);
            else if (messageSplit[1] === 'V') {
                channel.send(`@${username}, good warrior, we are need this! Here is all easy, if you see a expensive things, then take it. When you will be ready for raid write !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'C') {
                channel.send(`@${username}, Attention! Now this place is your new home. I have many tasks for you, when you will be ready for raid write !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'J') {
                channel.send(`@${username} welcome. Now you are samurai. Protect katana as a wife and use wakizashi as a feather. When you will be ready for raid write !raid`);
                Database.add.user(username, messageSplit[1]);
            } else if (messageSplit[1] === 'K' && username === 'jourloy') {
                channel.send(`@${username}, now you not a simple man. Now you better other. You are in highest class. You are soul master. When you will be ready for raid write !raid`);
                Database.add.user(username, messageSplit[1]);
            }
        } else {
            if (game.fraction === 'C') channel.send(`@${username}, your fraction is the fight squad "Caesar" `);
            else if (game.fraction === 'V') channel.send(`@${username}, your fraction is the Vikings`);
            else if (game.fraction === 'J') channel.send(`@${username}, your fraction is the samurai clan "Sakura"`);
            else if (game.fraction === 'K') channel.send(`@${username}, your fraction is the Soul Master`);
        }
        
    } else if (split[0] === '!connect') {

        const twitchUsername = split[1];
        const user = Database.get.bankUser(twitchUsername);
        if (user === errors.ERR_NOT_FIND_USER) channel.send(`@${username}, this user not find in my database`);
        else {
            const id = tools.randomInt(10000, 99999);
            Database.update.connectID(twitchUsername, id);
            const { twitch } = require('./twitch');
            twitch.connect(twitchUsername, username);
        }
    }
}

/* REACTIONS */
client.on('message', msg => {
    if (msg.author.bot) return;
    const channel = msg.channel;
    const username = msg.author.username.toLowerCase();

    const information = {
        channel: channel,
        username: username,
        message: msg.content,
    }

    if (channel.name === 'raids') {
        channelRaids(information);
    }

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
            else channel.send(`@${username}, в данный момент ворота из города закрыта, выйти не возможно`);
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