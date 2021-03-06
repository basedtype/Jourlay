const { tools } = require('../Utils/tools');
const moment = require('moment');
const Discord = require("discord.js");

class Game {
    static repair(channel, userCollection) {
        userCollection.find({}).toArray((err, users) => {
            for (let i in users) {
                const user = users[i];
                if (user == null || user.game == null || user.game.inRaid == null || user.game.inRaid === false) continue;
                const username = user.username;

                const created = user.game.raid.created;
                const timeRaid = user.game.raid.time;
                const now = Math.floor(moment.now() / 1000);
                const russian = false;
                let upd = {
                    game: user.game
                }
                if (created+timeRaid < now) {
                    const xp = user.game.raid.xp;
                    const wallet = user.game.raid.wallet;
                    if (russian) {
                        if (user.game.fraction === 'C') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Возвращение`)
                            .setColor(0x00ff00)
                            .setDescription(`Смирно, боец цезарь! Задача выполнена`)
                            .addFields(
                                { name: 'Опыт', value: `${xp}`, inline: true},
                                { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                            )
                            channel.send(`<@${user.id}>`, {embed: embed});
                        } else if (user.game.fraction === 'V') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Возвращение`)
                            .setColor(0x00ff00)
                            .setDescription(`Посмотрите кто пришел, хахаха. Садись и выпей с нами, викинг!`)
                            .addFields(
                                { name: 'Опыт', value: `${xp}`, inline: true},
                                { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                            )
                            channel.send(`<@${user.id}>`, {embed: embed});
                        } else if (user.game.fraction === 'J') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Возвращение`)
                            .setColor(0x00ff00)
                            .setDescription(`Я рад видеть тебя, самурай. Пошли выпьем чаю`)
                            .addFields(
                                { name: 'Опыт', value: `${xp}`, inline: true},
                                { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                            )
                            channel.send(`<@${user.id}>`, {embed: embed});
                        }
                    } else {
                        if (user.game.fraction === 'C') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Come back`)
                            .setColor(0x00ff00)
                            .setDescription(`Attention, "Caesar" fighter! Task is done`)
                            .addFields(
                                { name: 'XP', value: `${xp}`, inline: true},
                                { name: 'Single world currency', value: `${wallet}`, inline: true},
                            )
                            channel.send(`<@${user.id}>`, {embed: embed});
                        } else if (user.game.fraction === 'V') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Come back`)
                            .setColor(0x00ff00)
                            .setDescription(`Look who came, hahaha. Sit down and drink with us, viking!`)
                            .addFields(
                                { name: 'XP', value: `${xp}`, inline: true},
                                { name: 'Single world currency', value: `${wallet}`, inline: true},
                            )
                            channel.send(`<@${user.id}>`, {embed: embed});
                        } else if (user.game.fraction === 'J') {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Come back`)
                            .setColor(0x00ff00)
                            .setDescription(`Glad to see you, samurai. Go drink a tea`)
                            .addFields(
                                { name: 'XP', value: `${xp}`, inline: true},
                                { name: 'Single world currency', value: `${wallet}`, inline: true},
                            )
                            channel.send(`<@${user.id}>`, {embed: embed});
                        }
                    }
                    console.log(`Twitch => Jourloy_bot => Game => End raid => ${username} => wallet: +${wallet} | xp: ${xp}`);
                    userCollection.findOne({username: username}).then((user) => {
                        upd = {
                            game: user.game
                        }
                        upd.game.inRaid = false;
                        upd.game.wallet = user.game.wallet+wallet;
                        upd.game.raid = {
                            created: null,
                            time: null,
                            wallet: 0,
                            xp: 0,
                        }
                        upd.game.hero.xp = user.game.hero.xp + xp;
                        if (upd.game.hero.xp > user.game.hero.level * 100 + (user.game.hero.level * 15)) {
                            upd.game.hero.level++;
                            upd.game.hero.xp -= user.game.hero.level * 100 + (user.game.hero.level * 15);
                        }
                        userCollection.updateOne({username: username}, {$set: upd});
                    })
                } else {
                    const xp = user.game.raid.xp;
                    const wallet = user.game.raid.wallet;
                    const time = created+timeRaid-now;
                    let hours = Math.floor(time/60/60);
                    let minutes = Math.floor(time/60)-(hours*60);
                    let seconds = time%60;

                    const formatted = [
                        hours.toString().padStart(2, '0'),
                        minutes.toString().padStart(2, '0'),
                        seconds.toString().padStart(2, '0')
                    ].join(':');

                    console.log(`Twitch => Jourloy_bot => Game => Continue raid => ${username} => ${formatted}`);

                    setTimeout(function() {
                        if (russian) {
                            if (user.game.fraction === 'C') {
                                const embed = new Discord.MessageEmbed()
                                .setTitle(`Возвращение`)
                                .setColor(0x00ff00)
                                .setDescription(`Смирно, боец цезарь! Задача выполнена`)
                                .addFields(
                                    { name: 'Опыт', value: `${xp}`, inline: true},
                                    { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                                )
                                channel.send(`<@${user.id}>`, {embed: embed});
                            } else if (user.game.fraction === 'V') {
                                const embed = new Discord.MessageEmbed()
                                .setTitle(`Возвращение`)
                                .setColor(0x00ff00)
                                .setDescription(`Посмотрите кто пришел, хахаха. Садись и выпей с нами, викинг!`)
                                .addFields(
                                    { name: 'Опыт', value: `${xp}`, inline: true},
                                    { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                                )
                                channel.send(`<@${user.id}>`, {embed: embed});
                            } else if (user.game.fraction === 'J') {
                                const embed = new Discord.MessageEmbed()
                                .setTitle(`Возвращение`)
                                .setColor(0x00ff00)
                                .setDescription(`Я рад видеть тебя, самурай. Пошли выпьем чаю`)
                                .addFields(
                                    { name: 'Опыт', value: `${xp}`, inline: true},
                                    { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                                )
                                channel.send(`<@${user.id}>`, {embed: embed});
                            }
                        } else {
                            if (user.game.fraction === 'C') {
                                const embed = new Discord.MessageEmbed()
                                .setTitle(`Come back`)
                                .setColor(0x00ff00)
                                .setDescription(`Attention, "Caesar" fighter! Task is done`)
                                .addFields(
                                    { name: 'XP', value: `${xp}`, inline: true},
                                    { name: 'Single world currency', value: `${wallet}`, inline: true},
                                )
                                channel.send(`<@${user.id}>`, {embed: embed});
                            } else if (user.game.fraction === 'V') {
                                const embed = new Discord.MessageEmbed()
                                .setTitle(`Come back`)
                                .setColor(0x00ff00)
                                .setDescription(`Look who came, hahaha. Sit down and drink with us, viking!`)
                                .addFields(
                                    { name: 'XP', value: `${xp}`, inline: true},
                                    { name: 'Single world currency', value: `${wallet}`, inline: true},
                                )
                                channel.send(`<@${user.id}>`, {embed: embed});
                            } else if (user.game.fraction === 'J') {
                                const embed = new Discord.MessageEmbed()
                                .setTitle(`Come back`)
                                .setColor(0x00ff00)
                                .setDescription(`Glad to see you, samurai. Go drink a tea`)
                                .addFields(
                                    { name: 'XP', value: `${xp}`, inline: true},
                                    { name: 'Single world currency', value: `${wallet}`, inline: true},
                                )
                                channel.send(`<@${user.id}>`, {embed: embed});
                            }
                        }
                        console.log(`Twitch => Jourloy_bot => Game => End raid => ${username} => wallet: +${wallet} | xp: ${xp}`);
                        userCollection.findOne({username: username}).then((user) => {
                            upd = {
                                game: user.game
                            }
                            upd.game.inRaid = false;
                            upd.game.wallet = user.game.wallet+wallet;
                            upd.game.raid = {
                                created: null,
                                time: null,
                                wallet: 0,
                                xp: 0,
                            }
                            upd.game.hero.xp = user.game.hero.xp + xp;
                            if (upd.game.hero.xp > user.game.hero.level * 100 + (user.game.hero.level * 15)) {
                                upd.game.hero.level++;
                                upd.game.hero.xp -= user.game.hero.level * 100 + (user.game.hero.level * 15);
                            }
                            userCollection.updateOne({username: username}, {$set: upd});
                        })
                    }, tools.convertTime({seconds: time}));
                }
            }
        });
    }

    static toRaid(username, msg, channel, userCollection, russian) {
        userCollection.findOne({username: username}).then((user) => {
            let upd = {
                game: user.game
            }
            upd.game.wallet -= 1;
            userCollection.updateOne({username:username}, {$set: upd});

            let time = null;
            if (user.game.hero.level <= 2) time = tools.randomInt(1, 2) * tools.randomInt(3600, 5000);
            else if (user.game.hero.level <= 4) time = tools.randomInt(2, 3) * tools.randomInt(3600, 5000);
            else if (user.game.hero.level <= 6) time = tools.randomInt(3, 4) * tools.randomInt(3600, 5000);
            else if (user.game.hero.level <= 8) time = tools.randomInt(4, 5) * tools.randomInt(3600, 5000);
            else if (user.game.hero.level > 8) time = tools.randomInt(5, 6) * tools.randomInt(3600, 5000);
            if (username === 'jourloy') time = tools.randomInt(30, 55);

            const timePercent = time / 100;
            if (user.game.fraction === 'V') {
                time -= timePercent * 15;
            } else if (user.game.fraction === 'J') {
                time += timePercent * 15;
            } else if (user.game.fraction === 'C') {
                time -= timePercent * 15; 
            }

            time = Math.floor(time);
            let hours = Math.floor(time/60/60);
            let minutes = Math.floor(time/60)-(hours*60);
            let seconds = time%60;

            const formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');

            let lucky = user.game.hero.lucky;
            let wallet = null;
            let xp = null;
            let hp = null;
            if (hours <= 1) {
                wallet = tools.randomInt(1, 3);
                xp = tools.randomInt(1, 10);
                hp = 100;
            } else if (hours === 2) {
                wallet = tools.randomInt(1, 6);
                xp = tools.randomInt(5, 15);
                hp = 100;
            } else if (hours === 3) {
                wallet = tools.randomInt(3, 8);
                xp = tools.randomInt(10, 19);
                hp = 100;
            } else if (hours === 4) {
                wallet = tools.randomInt(5, 9);
                xp = tools.randomInt(15, 23);
                hp = 100;
            } else if (hours === 5) {
                wallet = tools.randomInt(7, 11);
                xp = tools.randomInt(18, 25);
                hp = 100;
            } else if (hours >= 6) {
                wallet = tools.randomInt(9, 13);
                xp = tools.randomInt(20, 28);
                hp = 100;
            }

            if (russian) {
                if (user.game.fraction === 'C') {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Поход в рейд`)
                    .setColor(0x00ff00)
                    .setDescription(`Смирно, боец цезарь! У меня есть задача для тебя`)
                    .addFields(
                        { name: 'Возвращение через', value: `${formatted}`, inline: true},
                        { name: 'Удача', value: `${lucky}`, inline: true},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                } else if (user.game.fraction === 'V') {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Поход в рейд`)
                    .setColor(0x00ff00)
                    .setDescription(`Встретимся в Вальгалле, викинг! Не бойся ничего и помни: нет добычи - нет награды`)
                    .addFields(
                        { name: 'Возвращение через', value: `${formatted}`, inline: true},
                        { name: 'Удача', value: `${lucky}`, inline: true},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                } else if (user.game.fraction === 'J') {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Поход в рейд`)
                    .setColor(0x00ff00)
                    .setDescription(`Удачи в бою, самурай! Дай волю катане`)
                    .addFields(
                        { name: 'Возвращение через', value: `${formatted}`, inline: true},
                        { name: 'Удача', value: `${lucky}`, inline: true},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
            } else {
                if (user.game.fraction === 'C') {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Go in raid`)
                    .setColor(0x00ff00)
                    .setDescription(`Attention, "Caesar" fighter! I have a task for you`)
                    .addFields(
                        { name: 'Come back in', value: `${formatted}`, inline: true},
                        { name: 'Lucky', value: `${lucky}`, inline: true},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                } else if (user.game.fraction === 'V') {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Go in raid`)
                    .setColor(0x00ff00)
                    .setDescription(`Will meet in Valhalla, viking. Don't fear anyone and remember: don't have loot - don't have reward`)
                    .addFields(
                        { name: 'Come back in', value: `${formatted}`, inline: true},
                        { name: 'Lucky', value: `${lucky}`, inline: true},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                } else if (user.game.fraction === 'J') {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Go in raid`)
                    .setColor(0x00ff00)
                    .setDescription(`Good luck in fight, samurai. Let katana do that, for what it`)
                    .addFields(
                        { name: 'Come back in', value: `${formatted}`, inline: true},
                        { name: 'Lucky', value: `${lucky}`, inline: true},
                    )
                    channel.send(`<@${msg.author.id}>`, {embed: embed});
                }
            }
            console.log(`Twitch => Jourloy_bot => Game => Start raid => ${username} => ${formatted}`);

            userCollection.findOne({username: username}).then(user => {
                upd = {
                    game: user.game
                }
                upd.game.inRaid = true;
                upd.game.raid = {
                    created: Math.floor(moment.now() / 1000),
                    time: time,
                    wallet: wallet,
                    xp: xp,
                }
                userCollection.updateOne({username: username}, {$set: upd});
            })

            setTimeout(function() {
                if (russian) {
                    if (user.game.fraction === 'C') {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`Возвращение`)
                        .setColor(0x00ff00)
                        .setDescription(`Смирно, боец цезарь! Задача выполнена`)
                        .addFields(
                            { name: 'Опыт', value: `${xp}`, inline: true},
                            { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                            { name: 'Здоровье', value: `${hp}`, inline: true},
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                    } else if (user.game.fraction === 'V') {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`Возвращение`)
                        .setColor(0x00ff00)
                        .setDescription(`Посмотрите кто пришел, хахаха. Садись и выпей с нами, викинг!`)
                        .addFields(
                            { name: 'Опыт', value: `${xp}`, inline: true},
                            { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                            { name: 'Здоровье', value: `${hp}`, inline: true},
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                    } else if (user.game.fraction === 'J') {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`Возвращение`)
                        .setColor(0x00ff00)
                        .setDescription(`Я рад видеть тебя, самурай. Пошли выпьем чаю`)
                        .addFields(
                            { name: 'Опыт', value: `${xp}`, inline: true},
                            { name: 'Единая мировая валюта', value: `${wallet}`, inline: true},
                            { name: 'Здоровье', value: `${hp}`, inline: true},
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                    }
                } else {
                    if (user.game.fraction === 'C') {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`Come back`)
                        .setColor(0x00ff00)
                        .setDescription(`Attention, "Caesar" fighter! Task is done`)
                        .addFields(
                            { name: 'XP', value: `${xp}`, inline: true},
                            { name: 'Single world currency', value: `${wallet}`, inline: true},
                            { name: 'Heal points', value: `${hp}`, inline: true},
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                    } else if (user.game.fraction === 'V') {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`Come back`)
                        .setColor(0x00ff00)
                        .setDescription(`Look who came, hahaha. Sit down and drink with us, viking!`)
                        .addFields(
                            { name: 'XP', value: `${xp}`, inline: true},
                            { name: 'Single world currency', value: `${wallet}`, inline: true},
                            { name: 'Heal points', value: `${hp}`, inline: true},
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                    } else if (user.game.fraction === 'J') {
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`Come back`)
                        .setColor(0x00ff00)
                        .setDescription(`Glad to see you, samurai. Go drink a tea`)
                        .addFields(
                            { name: 'XP', value: `${xp}`, inline: true},
                            { name: 'Single world currency', value: `${wallet}`, inline: true},
                            { name: 'Heal points', value: `${hp}`, inline: true},
                        )
                        channel.send(`<@${msg.author.id}>`, {embed: embed});
                    }
                }
                console.log(`Twitch => Jourloy_bot => Game => End raid => ${username} => wallet: +${wallet} | xp: ${xp}`);
                userCollection.findOne({username: username}).then((user) => {
                    upd = {
                        game: user.game
                    }
                    upd.game.inRaid = false;
                    upd.game.wallet = user.game.wallet+wallet;
                    upd.game.raid = {
                        created: null,
                        time: null,
                        wallet: 0,
                        xp: 0,
                    }
                    upd.game.hero.xp = user.game.hero.xp + xp;
                    if (upd.game.hero.xp > user.game.hero.level * 100 + (user.game.hero.level * 15)) {
                        upd.game.hero.level++;
                        upd.game.hero.xp -= user.game.hero.level * 100 + (user.game.hero.level * 15);
                    }
                    userCollection.updateOne({username: username}, {$set: upd});
                })
            }, tools.convertTime({seconds: time}));
        })
    }
}

module.exports.Game = Game;