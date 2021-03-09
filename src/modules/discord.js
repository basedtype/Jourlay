/* IMPORTS */
const { client } = require("./Bots/Jourlay");
const { Game } = require('./game');
const { tools, Errors } = require('../Utils/tools');
const { stats } = require('../../stats');
const Discord = require("discord.js");
const { MongoClient } = require("mongodb");
const moment = require('moment');

/* PARAMS */
let database = null;
let userCollection = null;
let discordCollection = null;
let repaired = false;

const uri = "mongodb://192.168.0.104:12702/";
const clientDB = new MongoClient(uri);
let guild = null;
const CH = {
    'bot': '815257750879600642',
}; // Channels
const CL = {
    'GOLD': 0,
    'GREEN': 0,
    'BLUE': 0,
    'YELLOW': 0,
    'RED': 0,
    'WHITE': 0,
    'PINK': 0,
    'ORANGE': 0,
    'SKY': 0,
}; // Colors

/* CODE */
clientDB.connect().then( err => {
    database = clientDB.db('TwitchBot');
    userCollection = database.collection('users');
    discordCollection = database.collection('discord');
    gameCollection = database.collection('game');
});

/* INTERVALS */
setInterval(function() {
    if (guild == null) {
        const guilds = client.guilds.cache.array();
        for (let i in guilds) {
            if (guilds[i].id === '437601028662231040') guild = guilds[i];
        }
    }
}, tools.convertTime({seconds: 1}));

setInterval(function() {
    let check = 0;
    for (let i in CL) {
        if (CL[i] !== 0 && CL[i] != null) check++;
    }
    if (check === CL.length) return;
    if (guild == null) {
        console.log(`Guild is undefined`);
        return;
    }
    const roles = guild.roles.cache.array();
    for (let i in roles) {
        if (CL[roles[i].name] === 0) CL[roles[i].name] = roles[i];
    }
    for (let i in CL) {
        if (CL[i] === 0) console.log(`${i} in undefined [ROLE]`);
    }
}, tools.convertTime({seconds: 1}));

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
    if (userCollection != null && CH['🛡│рейды'] != null && repaired === false) {
        Game.repair(CH['🛡│рейды'], userCollection);
        repaired = true;
    }
}, tools.convertTime({seconds: 1}))

client.on('guildMemberAdd', member => {
    let channel = null
    const channels = member.guild.channels.cache.array();
    for (let i in channels) if (channels[i].id === '811606058741006386') channel = channels[i];
    if (channel == null) return;
    channel.send(`**Welcome on JOURLOY server, <@${member.user.id}>!**
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
        else if (user.id == null) userCollection.findOneAndUpdate({username:username}, {$set: {id: msg.author.id}});
    });

    if (channel.name === 'bot') { // ========================================= CHANNEL ======================================================================

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
                            message.delete({timeout:tools.convertTime({seconds: 10})})
                        });
                    } else {
                        msg.delete();
                        channel.send(`${chn.name} already in database`).then(message => {
                            message.delete({timeout:tools.convertTime({seconds: 10})})
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
                    message.delete({timeout: tools.convertTime({seconds: 10})});
                });
                else chan.send(embed);
            })
        } else if (command === 'message') {
            const split = message.split(' | ');
            const id = split[1];
            const body = split[2];

            client.channels.fetch(id).then(chan => {
                if (chan == null) channel.send('This channel is undefind. Your id is correct?').then(message => {
                    message.delete({timeout: tools.convertTime({seconds: 10})});
                });
                else chan.send(`${body}`);
            })
        } else if (command === 'delete') {
            const id = messageSplit[1];
            discordCollection.findOneAndDelete({id:id}).then(res => {
                channel.send('Channel was deleted').then(message => {
                    message.delete({timeout: tools.convertTime({seconds: 10})});
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
                mss.delete({timeout: tools.convertTime({seconds: 10})});
            });
        } else if (command === 'db_add') {
            const split = message.split(' | ');
            const target = split[1];
            const thing = split[2]; //wallet, xp, fraction
            let amount = null;
            if (thing !== 'fraction') amount = parseInt(split[3]);
            else amount = split[3];

            userCollection.findOne({username: target}).then(user => {
                if (user == null || user === []) {
                    const ex = {
                        username: target,
                        game: {
                            wallet: 0,
                            hero: {
                                level: 1,
                                xp: 0,
                                hp: 100,
                            }
                        }
                    }
                    if (thing === 'wallet') ex.game.wallet += amount;
                    else if (thing === 'xp') {
                        ex.game.hero.xp += amount;
                        if (ex.game.hero.xp > ex.game.hero.level * 100 + (ex.game.hero.level * 15)) {
                            ex.game.hero.level++;
                            ex.game.hero.xp -= ex.game.hero.level * 100 + (ex.game.hero.level * 15);
                        }
                    } else if (thing === 'fraction') ex.game.fraction = amount;
                    userCollection.insertOne(ex).then(() => {
                        channel.send(`User (${target}) added in database and add ${amount} ${thing}. Don't forget add fraction: __!db_add | username | fraction | [symbol]__`).then(mss => {
                            mss.delete({timeout: 10000});
                        });
                    });
                } else {
                    const data = user;
                    if (thing === 'wallet') data.game.wallet += amount;
                    else if (thing === 'xp') {
                        data.game.hero.xp += amount;
                        if (data.game.hero.xp > data.game.hero.level * 100 + (data.game.hero.level * 15)) {
                            data.game.hero.level++;
                            data.game.hero.xp -= data.game.hero.level * 100 + (data.game.hero.level * 15);
                        }
                    } else if (thing === 'fraction') data.game.fraction = amount;
                    userCollection.updateOne({username:target},{$set:data}).then(() => {
                        channel.send(`User (${target}) add ${amount} ${thing}`).then(mss => {
                            mss.delete({timeout: 10000});
                        });
                    });
                }
            })
        } else if (command === 'db_get') {
            const split = message.split(' | ');
            const target = split[1];

            userCollection.findOne({username: target}).then(user => {
                if (user == null || user === []) channel.send(`User is undefined`).then(mss => mss.delete({timeout: 10000}));
                else channel.send(`\`\`\`keys: ${Object.keys(username)}

username: ${user.username}
id: ${user.id}
game (keys): ${Object.keys(user.game)}
\`\`\``).then(mss => mss.delete({timeout:tools.convertTime({seconds: 30})}));
            })
        } else if (command === 'user') {
            const users = guild.members.cache.array();
            let user = null;
            for (let i in users) if (users[i].id === msg.author.id) user = users[i];
            console.log(user);
        } else if (command === 'embed_for_scorp') {
            const embed = new Discord.MessageEmbed()
            .setTitle('Название фильма')
            .addFields(
                { name: 'Предложил', value: 'Ник', inline: true},
                { name: 'Дата', value:'12.12.2023', inline: true},
            )
            .setURL('https://blank.html')
            .setFooter('клик по названию для перехода на yandex диск');
            channel.send(embed).then(mss => mss.delete({timeout: 10000}))
        }
        msg.delete();

    } else if (channel.name === '🤖│jourlay') { // ========================================= CHANNEL ======================================================================

        if (command === 'russia') {
            channel.send(`Пока что эти запросы обрабатываются в ручную, так что прошу подождать и не изменять никнейм, пока роль не будет выдана`).then(mss => mss.delete({timeout: tools.convertTime({seconds: 20})}));
            if (CH['moderator-only'] != null) CH['moderator-only'].send(`@JOURLOY, [${username}] wants in Russian category`);
        }
        msg.delete();

    } else if (channel.name === '🖌│творчество' || channel.name === '🖌│creative') { // ========================================= CHANNEL ======================================================================

        if (msg.attachments.size === 0) msg.delete();

    } else if (channel.name === '🛡│рейды') { // ========================================= CHANNEL ======================================================================

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
                                        baseLucky: 27,
                                        lucky: 27,
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
                                        baseLucky: 33,
                                        lucky: 33,
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
                                        baseLucky: 27,
                                        lucky: 27,
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
                        { name: 'Базовая удача', value: `${user.game.hero.baseLucky}`, inline: true },
                        { name: 'Текущая удача', value: `${user.game.hero.lucky}`, inline: true },
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
                    .setDescription(`Я не могу понять, какая у тебя фракция. Информация отправлена в канал модераторов`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    if (CH['moderator-only'] != null) CH['moderator-only'].send(`${username} don't have a fraction in database. Try to add in #bot by this command: __!db_add | ${username} | fraction | [symbol]`)
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
                    if (user.game.hero.lucky == null) {
                        let upd = {
                            game: user.game,
                        }
                        if (upd.game.fraction === 'V' || upd.game.fraction === 'J') {
                            upd.game.hero.baseLucky = 27;
                            upd.game.hero.lucky = 27;
                        } else {
                            upd.game.hero.baseLucky = 33;
                            upd.game.hero.lucky = 33;
                        }
                        userCollection.findOneAndUpdate({username: username}, {$set: upd}).then(res => {
                            Game.toRaid(username, msg, channel, userCollection, true);
                        })
                    } else Game.toRaid(username, msg, channel, userCollection, true);
                    return;
                }
            });
        } else if (command === 'магазин') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Market`)
            .addFields(
                { name: 'Potions', value: `!магазин_зелья`, inline: true},
                { name: 'Weapons', value: `!магазин_оружие`, inline: true},
                { name: 'Misc', value: `!магазин_разное`, inline: true}
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'магазин_зелья') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Potions`)
            .setColor(0xffff00)
            .addFields(
                { name: 'Potion of Lucky', value: `Price: 13 SWC (!buy p_lucky) | +5% to lucky`, inline: true},
                { name: 'Potion of Swiftness', value: `Price: 12 SWC (!buy p_speed) | -3% to raid time`, inline: true},
                { name: 'Potion of Vision', value: `Price: 15 SWC (!buy p_vision) | +4% to rewards from raid`, inline: true},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'магазин_оружие') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Closed`)
            .setColor(0xff0000)
            .addDescription('Closed')
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'магазин_разное') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Misc`)
            .setColor(0xffff00)
            .addFields(
                { name: 'Name color', value: `**GOLD** | !buy gold_color | Price: 100 SWC | Time: 14 days\n**GREEN** | !buy green_color | Price: 75 SWC | Time: 14 days\n**BLUE** | !buy blue_color | Price: 50 SWC | Time: 14 days\n**YELLOW** | !buy yellow_color | Price: 75 SWC | Time: 14 days\n**RED** | !buy red_color | Price: 75 SWC | Time: 14 days\n**WHITE** | !buy white_color | Price: 40 SWC | Time: 14 days\n**ORANGE** | !buy orange_color | Price: 50 SWC | Time: 14 days\n**SKY** | !buy sky_color | Price: 50 SWC | Time: 14 days\n**PINK** | !buy pink_color | Price: 75 SWC | Time: 14 days`, inline: true},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'buy') {
            const thing = messageSplit[1];

            if (thing === 'gold_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 100) {
                            user.roles.add(CL['GOLD']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 100;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'green_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['GREEN']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'yellow_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['YELLOW']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'blue_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 50) {
                            user.roles.add(CL['BLUE']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 50;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'red_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['RED']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'white_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 40) {
                            user.roles.add(CL['WHITE']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 40;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'pink_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['PINK']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'orange_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 50) {
                            user.roles.add(CL['ORANGE']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 50;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'sky_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 50) {
                            user.roles.add(CL['SKY']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 50;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            }
            else msg.delete();
        } else if (command === 'статус') {
            userCollection.findOne({username:username}).then(user => {
                if (user.game.inRaid === true) {
                    const now = Math.floor(moment.now() / 1000);
                    const timeRaid = user.game.raid.time;
                    const created = user.game.raid.created;

                    const time = (timeRaid + created) - now;

                    let hours = Math.floor(time/60/60);
                    let minutes = Math.floor(time/60)-(hours*60);
                    let seconds = time%60;

                    const formatted = [
                        hours.toString().padStart(2, '0'),
                        minutes.toString().padStart(2, '0'),
                        seconds.toString().padStart(2, '0')
                    ].join(':');

                    const embed = new Discord.MessageEmbed()
                    .setTitle(`В рейде`)
                    .setDescription(`Твой персонаж находится в рейде. Осталось ${formatted}`)
                    .setColor(0x00ff00)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                } else {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Готов`)
                    .setDescription(`Твой персонаж готов отправиться в рейд (**!рейд**)`)
                    .setColor(0x00ff00)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
            })
        }
        else msg.delete();

    } else if (channel.name === '🔫│loadouts') { // ========================================= CHANNEL ======================================================================

        if (command === 'weapons') {
            const embed = new Discord.MessageEmbed()
            .setTitle('All guns')
            .addFields(
                { name: 'Modern Warfare', value: `ASSAULT RIFLES:\n- !m4a1\n\nSMGS:\n- !mp5\n\nMARKSMAN RIFLES:\n- !spr\n- !kar\n\nHANDGUNS:\n!x16`, inline: true},
                { name: 'Cold War', value: `ASSAULT RIFLES:\n- !ffar`, inline: true},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        } else if (command === 'm4a1') {
            const embed = new Discord.MessageEmbed()
            .setTitle('M4A1 (MW)')
            .addFields(
                { name: 'Muzzle', value: `Monolithic Suppressor (7)`},
                { name: 'Barrel', value: `Stock M16 Grenadier (2)`},
                { name: 'Laser', value: `-`},
                { name: 'Optic', value: `G.I. Mini Reflex (13)`},
                { name: 'Underbarrel', value: `Commando Foregrip (1)`},
                { name: 'Ammunition', value: `9mm Para 32-rounds Mags (3)`},
                { name: 'Rear Grip', value: `-`},
                { name: 'Perk', value: `-`},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        } else if (command === 'mp5') {
            const embed = new Discord.MessageEmbed()
            .setTitle('MP5 (MW)')
            .addFields(
                { name: 'Muzzle', value: `Monolithic Suppressor (4)`},
                { name: 'Barrel', value: `-`},
                { name: 'Laser', value: `Tac Laser (3)`},
                { name: 'Optic', value: `-`},
                { name: 'Stock', value: `FTAC Collapsible (4)`},
                { name: 'Underbarrel', value: `Merc Foregrip (2)`},
                { name: 'Ammunition', value: `45 Round Mags (1)`},
                { name: 'Rear Grip', value: `-`},
                { name: 'Perk', value: `-`},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        } else if (command === 'spr') {
            const embed = new Discord.MessageEmbed()
            .setTitle('SP-R (MW)')
            .addFields(
                { name: 'Muzzle', value: `Monolithic Suppressor (7)`},
                { name: 'Barrel', value: `SP-R 26" (3)`},
                { name: 'Laser', value: `Tac Laser (1)`},
                { name: 'Optic', value: `Solozero SP-R 28mm (10)`},
                { name: 'Stock', value: `-`},
                { name: 'Underbarrel', value: `-`},
                { name: 'Ammunition', value: `.300 Norma Mag 5-R Mags (2)`},
                { name: 'Rear Grip', value: `-`},
                { name: 'Perk', value: `-`},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        } else if (command === 'kar') {
            const embed = new Discord.MessageEmbed()
            .setTitle('KAR98K (MW)')
            .addFields(
                { name: 'Muzzle', value: `Monolithic Suppressor (5)`},
                { name: 'Barrel', value: `Singuard Xustom 27.6" (3)`},
                { name: 'Laser', value: `Tac Laser (1)`},
                { name: 'Optic', value: `Sniper Scope (8)`},
                { name: 'Stock', value: `FTAC Sport Comb (3)`},
                { name: 'Underbarrel', value: `-`},
                { name: 'Rear Grip', value: `-`},
                { name: 'Perk', value: `-`},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        } else if (command === 'x16') {
            const embed = new Discord.MessageEmbed()
            .setTitle('X16 (MW)')
            .addFields(
                { name: 'Muzzle', value: `Monolithic Suppressor (2)`},
                { name: 'Barrel', value: `-`},
                { name: 'Laser', value: `5mW Laser (3)`},
                { name: 'Optic', value: `-`},
                { name: 'Trigger Action', value: `Lightweight Trigger (1)`},
                { name: 'Ammunition', value: `26 Round Mags (2)`},
                { name: 'Rear Grip', value: `-`},
                { name: 'Perk', value: `Akimbo (10)`},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        } else if (command === 'ffar') {
            const embed = new Discord.MessageEmbed()
            .setTitle('FFAR (CW)')
            .addFields(
                { name: 'Muzzle', value: `-`},
                { name: 'Barrel', value: `19.5" Reinforced Heavy (3)`},
                { name: 'Laser', value: `Embed sighting Point (6)`},
                { name: 'Optic', value: `-`},
                { name: 'Stock', value: `Raider Stock (6)`},
                { name: 'Underbarrel', value: `SFOD Speedgrip (6)`},
                { name: 'Ammunition', value: `Salvo 50 Rnd Fast Mag (6)`},
                { name: 'Rear Grip', value: `-`},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        }
        else msg.delete();

    } else if (channel.name === '📝│общение') { // ========================================= CHANNEL ======================================================================

        if (command === 'бот') {
            const lines = stats.getLines();
            const embed = new Discord.MessageEmbed()
            .setColor(0x00ff00)
            .addFields(
                { name: 'Строк кода', value: lines, inline: true}
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        }

    } else if (channel.name === '📝│chatting') { // ========================================= CHANNEL ======================================================================

        if (command === 'bot') {
            const lines = stats.getLines();
            const embed = new Discord.MessageEmbed()
            .setColor(0x00ff00)
            .addFields(
                { name: 'Lines of code', value: lines, inline: true}
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
        }

    } else if (channel.name === '🛡│raids') { // ========================================= CHANNEL ======================================================================

        if (command === 'fraction') {
            if (messageSplit[1] == null || (messageSplit[1] !== 'V' && messageSplit[1] !== 'J' && messageSplit[1] !== 'C' && (messageSplit[1] !== 'K' && username !== 'jourloy'))) {
                const embed = new Discord.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`After __!fraction__ you must type a fraction symbol`)
                .setColor(0xff0000)
                .addFields(
                    { name: 'VIKING', value: 'Use **!fraction V**', inline: true },
                    { name: 'CAESAR', value: 'Use **!fraction C**', inline: true },
                    { name: 'SAMURAI', value: 'Use **!fraction J**', inline: true },
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
                            .setTitle(`Welcome`)
                            .setDescription(`Good warrior, we need this. All is easy: if you look something expensive, then take it`)
                            .setColor(0x00ff00)
                            .addFields(
                                { name: '!raid', value: 'Go to the raid', inline: true },
                                { name: '!status', value: 'Get raid status', inline: true },
                                { name: '!hero', value: 'Get hero information', inline: true },
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
                                        baseLucky: 27,
                                        lucky: 27,
                                    }
                                }
                            }
                            userCollection.updateOne({username: username}, {$set: upd});
                        } else if (messageSplit[1] === 'C') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Welcome`)
                            .setDescription(`Attention! Now it is your new home. I have many tasks for you`)
                            .setColor(0x00ff00)
                            .addFields(
                                { name: '!raid', value: 'Go to the raid', inline: true },
                                { name: '!status', value: 'Get raid status', inline: true },
                                { name: '!hero', value: 'Get hero information', inline: true },
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
                                        baseLucky: 33,
                                        lucky: 33,
                                    }
                                }
                            }
                            userCollection.updateOne({username: username}, {$set: upd});
                        } else if (messageSplit[1] === 'J') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Welcome`)
                            .setDescription(`Now you are samurai. Protect you katana as a wife and use your vakidzashi as feather`)
                            .setColor(0x00ff00)
                            .addFields(
                                { name: '!raid', value: 'Go to the raid', inline: true },
                                { name: '!status', value: 'Get raid status', inline: true },
                                { name: '!hero', value: 'Get hero information', inline: true },
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
                                        baseLucky: 27,
                                        lucky: 27,
                                    }
                                }
                            }
                            userCollection.updateOne({username: username}, {$set: upd});
                        }
                    });
                } else {
                    if (user.game.fraction != null) {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`You alredy in a fraction`)
                        .setDescription(`Your fraction is ${user.game.fraction}`)
                        .setColor(0x00ff00)
                        .addFields(
                            { name: '!raid', value: 'Go to the raid', inline: true },
                            { name: '!status', value: 'Get raid status', inline: true },
                            { name: '!hero', value: 'Get hero information', inline: true },
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                        return;
                    }
                }
            });
        } else if (command === 'hero') {
            userCollection.findOne({username:username}).then(user => {
                if (user == null && user === []) return;
                else if (user.game == null) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`I can't find you in my database. Use __!fraction__ for registration`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
                else if (user.game.hero == null) console.log(`Database => Error => ${username} => Hero`);
                else {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Your hero`)
                    .setColor(0x00ff00)
                    .addFields(
                        { name: 'Wallet', value: `${user.game.wallet} SWC`, inline: true },
                        { name: 'XP', value: `${user.game.hero.level} level (${user.game.hero.xp}/${user.game.hero.level * 100 + (user.game.hero.level * 15)})`, inline: true },
                        { name: 'Heal points', value: `${user.game.hero.hp} heal points`, inline: true },
                    )
                    .addFields(
                        { name: 'Base lucky', value: `${user.game.hero.baseLucky}`, inline: true },
                        { name: 'Lucky', value: `${user.game.hero.lucky}`, inline: true },
                    )
                    .addFields(
                        { name: 'Inventory', value: `Closed`},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
            });
        } else if (command === 'raid') {
            userCollection.findOne({username: username}).then((user) => {
                if (user == null && user === []) return;
                if (user.game == null) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`I can't find you in my database. Use __!fraction__ for registration`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    return;
                } else if (user.game.fraction == null) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`I can't find your fraction. I send ticket in moderator channel`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    if (CH['moderator-only'] != null) CH['moderator-only'].send(`${username} don't have a fraction in database. Try to add in #bot by this command: __!db_add | ${username} | fraction | [symbol]`)
                    return;
                } else if (user.game.inRaid === true) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`You already in raid`)
                    .setColor(0xff0000)
                    .addFields(
                        { name: '!raid', value: 'Go to the raid', inline: true },
                        { name: '!status', value: 'Get raid status', inline: true },
                        { name: '!hero', value: 'Get hero information', inline: true },
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    return;
                } else if (user.game.wallet < 1) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`You haven't enough SWC for raid`)
                    .setColor(0xff0000)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                    return;
                } else {
                    if (user.game.hero.lucky == null) {
                        let upd = {
                            game: user.game,
                        }
                        if (upd.game.fraction === 'V' || upd.game.fraction === 'J') {
                            upd.game.hero.baseLucky = 27;
                            upd.game.hero.lucky = 27;
                        } else {
                            upd.game.hero.baseLucky = 33;
                            upd.game.hero.lucky = 33;
                        }
                        userCollection.findOneAndUpdate({username: username}, {$set: upd}).then(res => {
                            Game.toRaid(username, msg, channel, userCollection);
                        })
                    } else Game.toRaid(username, msg, channel, userCollection);
                    return;
                }
            });
        } else if (command === 'market') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Market`)
            .addFields(
                { name: 'Potions', value: `!market_potions`, inline: true},
                { name: 'Weapons', value: `!market_weapons`, inline: true},
                { name: 'Misc', value: `!market_misc`, inline: true}
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'market_potions') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Potions`)
            .setColor(0xffff00)
            .addFields(
                { name: 'Potion of Lucky', value: `Price: 13 SWC (!buy p_lucky) | +5% to lucky`, inline: true},
                { name: 'Potion of Swiftness', value: `Price: 12 SWC (!buy p_speed) | -3% to raid time`, inline: true},
                { name: 'Potion of Vision', value: `Price: 15 SWC (!buy p_vision) | +4% to rewards from raid`, inline: true},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'market_weapons') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Closed`)
            .setColor(0xff0000)
            .addDescription('Closed')
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'market_misc') {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Misc`)
            .setColor(0xffff00)
            .addFields(
                { name: 'Name color', value: `**GOLD** | !buy gold_color | Price: 100 SWC | Time: 14 days\n**GREEN** | !buy green_color | Price: 75 SWC | Time: 14 days\n**BLUE** | !buy blue_color | Price: 50 SWC | Time: 14 days\n**YELLOW** | !buy yellow_color | Price: 75 SWC | Time: 14 days\n**RED** | !buy red_color | Price: 75 SWC | Time: 14 days\n**WHITE** | !buy white_color | Price: 40 SWC | Time: 14 days\n**ORANGE** | !buy orange_color | Price: 50 SWC | Time: 14 days\n**SKY** | !buy sky_color | Price: 50 SWC | Time: 14 days\n**PINK** | !buy pink_color | Price: 75 SWC | Time: 14 days`, inline: true},
            )
            channel.send(`<@${msg.author.id}>`, {embed: embed});
            return;
        } else if (command === 'buy') {
            const thing = messageSplit[1];

            if (thing === 'gold_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 100) {
                            user.roles.add(CL['GOLD']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 100;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'green_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['GREEN']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'yellow_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['YELLOW']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'blue_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 50) {
                            user.roles.add(CL['BLUE']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 50;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'red_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['RED']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'white_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 40) {
                            user.roles.add(CL['WHITE']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 40;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'pink_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 75) {
                            user.roles.add(CL['PINK']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 75;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'orange_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 50) {
                            user.roles.add(CL['ORANGE']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 50;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            } else if (thing === 'sky_color') {
                const users = guild.members.cache.array();
                let user = null;
                for (let i in users) if (users[i].id === msg.author.id) user = users[i];
                if (user != null) {
                    userCollection.findOne({username: username}).then(usr => {
                        if (usr.game.wallet >= 50) {
                            user.roles.add(CL['SKY']);
                            let upd = {
                                colorTime: Math.floor(moment.now() / 1000),
                                game: usr.game,
                            }
                            upd.game.wallet -= 50;
                            userCollection.findOneAndUpdate({username: username}, {$set: upd});
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Successful`)
                            .setColor(0x00ff00)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Error`)
                            .setDescription(`You don't have enough money for this operation`)
                            .setColor(0xff0000)
                            channel.send(`<@${msg.author.id}>`, {embed: embed});
                        }
                    })
                }
            }
            else msg.delete();
        } else if (command === 'status') {
            userCollection.findOne({username:username}).then(user => {
                if (user.game.inRaid === true) {
                    const now = Math.floor(moment.now() / 1000);
                    const timeRaid = user.game.raid.time;
                    const created = user.game.raid.created;

                    const time = (timeRaid + created) - now;

                    let hours = Math.floor(time/60/60);
                    let minutes = Math.floor(time/60)-(hours*60);
                    let seconds = time%60;

                    const formatted = [
                        hours.toString().padStart(2, '0'),
                        minutes.toString().padStart(2, '0'),
                        seconds.toString().padStart(2, '0')
                    ].join(':');

                    const embed = new Discord.MessageEmbed()
                    .setTitle(`You in raid`)
                    .setDescription(`Your hero in a raid. Return in ${formatted}`)
                    .setColor(0x00ff00)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                } else {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Ready`)
                    .setDescription(`Your hero is ready got to the raid (**!raid**)`)
                    .setColor(0x00ff00)
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
            })
        }
        else msg.delete();

    } else if (channel.name === '') { // ========================================= CHANNEL ======================================================================

    }
})