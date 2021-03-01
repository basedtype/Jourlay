const { client } = require("./Bots/Jourlay");

const Discord = require("discord.js");
const { MongoClient } = require("mongodb");
const { Tools, Errors } = require('../Utils/Tools');
const { Game } = require('./game');

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

/* PARAMS */
const CH = {
    'bot': '815257750879600642',
}; // Channels

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

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');
    if (!channel) return;
    channel.send(`**Welcome on JOURLOY server, ${username}!**
My name is JOURLOY, it's my server, where you can find teammates, get help with game, get notification about stream and just talking about what you want

**RULES**
Don't forget read our <#811606090852466740>

**CHATTING**
Wan't chatting? Let's go on <#815701215651430402>

**TALKING**
Server have channel where you can talking about all what happend around :)

**CREATE VOICE CHANNEL**
If you want play in team with your friends and talk in same time then look at "Create voice channel" category
Just join on channel and bot automatically move you in new voice channel with limit users

⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤`).then(mss => {
        mss.react('👋');
    });
});

client.on('message', msg => {
    if (msg.author.bot) return;
    const channel = msg.channel;
    const username = msg.author.username.toLowerCase();
    const message = msg.content;

    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];

    userCollection.findOne({username: username}).then((user) => {
        if (user == null || user === []) userCollection.insertOne({username: username});
    });

    const ru_alphabet = 'йцукенгшщзхъфывапролджэёячсмитьбюё';

    for (let i in message) {
        if (ru_alphabet.includes(message[i])) {
            const category = msg.channel.parent.name;
            if (category !== 'Russia' && channel.name !== 'bot') {
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
            console.log(msg);
        } else if (command === 'category') {
            console.log(msg.channel.parent);
        } else if (command === 'embed') {
            const split = message.split(' | ');
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
            const split = message.split(' | ');
            const id = split[1];
            const body = split[2];

            client.channels.fetch(id).then(chan => {
                if (chan == null) channel.send('This channel is undefind. Your id is correct?').then(message => {
                    message.delete({timeout: Tools.convertTime({seconds: 10})});
                });
                else chan.send(`${body}`);
            })
        } else if (command === 'delete') {
            const id = messageSplit[1];
            discordCollection.findOneAndDelete({id:id}).then(res => {
                channel.send('Channel was deleted').then(message => {
                    message.delete({timeout: Tools.convertTime({seconds: 10})});
                });
            });
        } else if (command === 'hi') {
            channel.send(`**Welcome on JOURLOY server, ${username}!**
My name is JOURLOY, it's my server, where you can find teammates, get help with game, get notification about stream and just talking about what you want

**RULES**
Don't forget read our <#811606090852466740>

**CHATTING**
Wan't chatting? Let's go on <#815701215651430402>

**TALKING**
Server have channel where you can talking about all what happend around :)

**CREATE VOICE CHANNEL**
If you want play in team with your friends and talk in same time then look at "Create voice channel" category
Just join on channel and bot automatically move you in new voice channel with limit users

⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤`).then(mss => {
                mss.react('👋');
                mss.delete({timeout: Tools.convertTime({seconds: 10})});
            });
        }
        msg.delete();
    } else if (channel.name === '🤖│jourlay') {
        if (command === 'russia') {
            channel.send(`Пока что эти запросы обрабатываются в ручную, так что прошу подождать и не изменять никнейм, пока роль не будет выдана`).then(mss => mss.delete({timeout: Tools.convertTime({seconds: 20})}));
            if (CH['moderator-only'] != null) CH['moderator-only'].send(`@JOURLOY, [${username}] wants in Russian category`);
        }
        msg.delete();
    } else if (channel.name === '🖌│творчество') {
        if (msg.attachments.size === 0) msg.delete();
    } else if (channel.name === '🛡│рейды') {
        if (command === 'фракция') {
            if (messageSplit[1] == null || (messageSplit[1] !== 'V' && messageSplit[1] !== 'J' && messageSplit[1] !== 'C' && (messageSplit[1] !== 'K' && username !== 'jourloy'))) {
                const embed = new Discord.MessageEmbed()
                .setTitle(`Ошибка`)
                .setDescription(`После !фракция необходимо использовать символ фракции`)
                .setColor(0xff0000)
                .addFields(
                    { name: 'ВИКИНГ', value: 'Используй **!фракция V**', inline: true },
                    { name: 'ЦЕЗАРЬ', value: 'Используй **!фракция C**', inline: true },
                    { name: 'САМУРАЙ', value: 'Используй **!фракция J**', inline: true },
                )
                channel.send(`<@${msg.author.id}>`, {embed: embed});
                return;
            }
            let gm = {
                game: {},
            }
            userCollection.findOne({username: username}).then((user) => {
                if (user == null || user == []) return;
                if (user.game == null) {
                    userCollection.updateOne({username: username}, {$set: gm}).then((user) => {
                        if (messageSplit[1] === 'V') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Добро пожаловать`)
                            .setDescription(`Хороший воин, нам нужны такие! Здесь все просто, если видишь что-то дорогое - возьми`)
                            .setColor(0x00ff00)
                            .addFields(
                                { name: '!рейд', value: 'Отправиться в рейд', inline: true },
                                { name: '!статус', value: 'Узнать текущий статус', inline: true },
                                { name: '!герой', value: 'Получить информацию о персонаже', inline: true },
                            )
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                            let upd = {
                                game: {
                                    wallet: 5,
                                    fraction: 'V',
                                    hero: {
                                        level: 1,
                                        xp: 0,
                                        hp: 100,
                                    }
                                }
                            }
                            userCollection.updateOne({username: username}, {$set: upd});
                        } else if (messageSplit[1] === 'C') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Добро пожаловать`)
                            .setDescription(`Смирно! Теперь это место твой новый дом. У меня есть много задач для тебя`)
                            .setColor(0x00ff00)
                            .addFields(
                                { name: '!рейд', value: 'Отправиться в рейд', inline: true },
                                { name: '!статус', value: 'Узнать текущий статус', inline: true },
                                { name: '!герой', value: 'Получить информацию о персонаже', inline: true },
                            )
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                            let upd = {
                                game: {
                                    wallet: 5,
                                    fraction: 'C',
                                    hero: {
                                        level: 1,
                                        xp: 0,
                                        hp: 100,
                                    }
                                }
                            }
                            userCollection.updateOne({username: username}, {$set: upd});
                        } else if (messageSplit[1] === 'J') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Добро пожаловать`)
                            .setDescription(`Добро пожаловать к нам, самурай. Береги катану, как жену свою, и используй вакидзаси, как перо`)
                            .setColor(0x00ff00)
                            .addFields(
                                { name: '!рейд', value: 'Отправиться в рейд', inline: true },
                                { name: '!статус', value: 'Узнать текущий статус', inline: true },
                                { name: '!герой', value: 'Получить информацию о персонаже', inline: true },
                            )
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                            let upd = {
                                game: {
                                    wallet: 5,
                                    fraction: 'J',
                                    hero: {
                                        level: 1,
                                        xp: 0,
                                        hp: 100,
                                    }
                                }
                            }
                            userCollection.updateOne({username: username}, {$set: upd});
                        }
                    });
                } else {
                    if (user.game.fraction != null) {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`Ты уже во фракции`)
                        .setDescription(`Твоя фракция: ${user.game.fraction}`)
                        .setColor(0x00ff00)
                        .addFields(
                            { name: '!рейд', value: 'Отправиться в рейд', inline: true },
                            { name: '!статус', value: 'Узнать текущий статус', inline: true },
                            { name: '!герой', value: 'Получить информацию о персонаже', inline: true },
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                        return;
                    }
                }
            });
        } else if (command === 'герой') {
            userCollection.findOne({username:username}).then(user => {
                if (user == null && user === []) return;
                else if (user.game == null) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Ошибка`)
                    .setDescription(`Я не могу найти тебя в своей базе данных, используй команду !фракция для регистрации`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
                else if (user.game.hero == null) console.log(`Database => Error => ${username} => Hero`);
                else {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Твой персонаж`)
                    .setColor(0x00ff00)
                    .addFields(
                        { name: 'Кошелек', value: `${user.game.wallet} ЕМД`, inline: true },
                        { name: 'Опыт', value: `${user.game.hero.level} уровень (${user.game.hero.xp}/${user.game.hero.level * 100 + (user.game.hero.level * 15)})`, inline: true },
                        { name: 'Здоровье', value: `${user.game.hero.hp} очков здоровья`, inline: true },
                    )
                    .addFields(
                        { name: 'Инвентарь', value: `Закрыто`},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
            });
        } else if (command === 'рейд') {
            userCollection.findOne({username: username}).then((user) => {
                if (user == null && user === []) return;
                console.log(user);
                if (user.game == null) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Ошибка`)
                    .setDescription(`Я не могу найти тебя в своей базе данных, используй команду !фракция для регистрации`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    return;
                } else if (user.game.fraction == null) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Ошибка`)
                    .setDescription(`Я не могу найти тебя в своей базе данных, используй команду !фракция для регистрации`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    return;
                } else if (user.game.inRaid === true) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Ошибка`)
                    .setDescription(`Кажется ты уже в рейде`)
                    .setColor(0xff0000)
                    .addFields(
                        { name: '!рейд', value: 'Отправиться в рейд', inline: true },
                        { name: '!статус', value: 'Узнать текущий статус', inline: true },
                        { name: '!герой', value: 'Получить информацию о персонаже', inline: true },
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    return;
                } else if (user.game.wallet < 1) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Ошибка`)
                    .setDescription(`У тебя не достаточно ЕМД для похода в рейд`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    return;
                } else {
                    Game.toRaid(username, msg, channel, userCollection, true);
                    return;
                }
            });
        }
        else msg.delete();
    }
})