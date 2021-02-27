const { Tools } = require('../Utils/Tools');
const moment = require('moment');

class Game {
    static toRaid(username, client, userCollection) {
        userCollection.findOne({username: username}).then((user) => {
            let hero = user.hero;
            if (hero == null) {
                hero = {
                    level: 1,
                    xp: 0,
                    hp: 100,
                }
            }
            let upd = {
                game: {
                    wallet: user.game.wallet,
                }
            }
            upd.game.wallet -= 1;
            userCollection.updateOne({username:username}, {$set: upd});

            let time = null;
            if (hero.level <= 2) time = Tools.randomInt(1, 2) * Tools.randomInt(3600, 5000);
            else if (hero.level <= 4) time = Tools.randomInt(2, 3) * Tools.randomInt(3600, 5000);
            else if (hero.level <= 6) time = Tools.randomInt(3, 4) * Tools.randomInt(3600, 5000);
            else if (hero.level <= 8) time = Tools.randomInt(4, 5) * Tools.randomInt(3600, 5000);
            else if (hero.level > 8) time = Tools.randomInt(5, 6) * Tools.randomInt(3600, 5000);
            if (username === 'jourloy') time = 32;

            const timePercent = time / 100;
            if (user.game.fraction === 'V') {
                time -= timePercent * 15;
            } else if (user.game.fraction === 'J') {
                time += timePercent * 15;
            } else if (user.game.fraction === 'C') {
                time -= timePercent * 15; 
            }

            let hours = Math.floor(time/60/60);
            let minutes = Math.floor(time/60)-(hours*60);
            let seconds = time%60;

            const formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');

            let wallet = null;
            let xp = null;
            let hp = null;
            if (hours <= 1) {
                wallet = Tools.randomInt(0, 3);
                xp = Tools.randomInt(1, 10);
                hp = 0;
            } else if (hours === 2) {
                wallet = Tools.randomInt(1, 6);
                xp = Tools.randomInt(5, 15);
                hp = 0;
            } else if (hours === 3) {
                wallet = Tools.randomInt(3, 8);
                xp = Tools.randomInt(10, 19);
                hp = 0;
            } else if (hours === 4) {
                wallet = Tools.randomInt(5, 9);
                xp = Tools.randomInt(15, 23);
                hp = 0;
            } else if (hours === 5) {
                wallet = Tools.randomInt(7, 11);
                xp = Tools.randomInt(18, 25);
                hp = 0;
            } else if (hours >= 6) {
                wallet = Tools.randomInt(9, 13);
                xp = Tools.randomInt(20, 28);
                hp = 0;
            }

            const walletPercent = wallet / 100;
            const xpPercent = xp / 100;

            if (user.game.fraction === 'V') {
                wallet += walletPercent * 2;
            } else if (user.game.fraction === 'J') {
                xp += xpPercent * 3;
                walllet -= walletPercent * 2;
            } else if (user.game.fraction === 'C') {
                xp -= xpPercent * 3;
            }

            if (user.game.fraction === 'C') client.say(client.channel, `@${username}, attention, "Caesar" fighter! I have a task for you. You will come back in ${formatted}`);
            if (user.game.fraction === 'V') client.say(client.channel, `@${username}, will meet in Valhalla, viking. Don't fear anyone and remember: don't have loot - don't have reward. You will come back in ${formatted}`);
            if (user.game.fraction === 'J') client.say(client.channel, `@${username}, good luck in fight, samurai. Let katana do that, for what it. You will come back in ${formatted}`);
            if (user.game.fraction === 'K') client.say(client.channel, `@${username}, need steal couple documents, soul master. You will come back in ${formatted}`);
            console.log(`Twitch => Jourloy_bot => Game => Start raid => ${username} => ${formatted}`);

            setTimeout(function() {
                if (user.game.fraction === 'C') client.say(client.channel, `@${username}, task is done, "Caesar" fighter! Your reward is ${wallet} bills and ${xp} experience points`);
                if (user.game.fraction === 'V') client.say(client.channel, `@${username}, look who came, hahaha. Sit down and drink with us, viking! Take ${wallet} gold coins and ${xp} experience points`);
                if (user.game.fraction === 'J') client.say(client.channel, `@${username}, glad to see you, samurai. Go drink a tea, and now I give you ${wallet} Great steel ingots and ${xp} experience points`);
                if (user.game.fraction === 'K') client.say(client.channel, `@${username}, thank you, soul master, I give ${wallet} soul shards and ${xp} experience points`);
                console.log(`Twitch => Jourloy_bot => Game => End raid => ${username} => wallet: +${wallet} | xp: ${xp}`);
                userCollection.findOne({username: username}).then((user) => {
                    upd = {
                        game: {
                            inRaid: false,
                            wallet: user.wallet+wallet,
                            raid: {
                                created: null,
                                time: null,
                                wallet: 0,
                                xp: 0,
                            }
                        }
                    }
                    userCollection.updateOne({username: username}, {$set: upd});
                })
            }, Tools.convertTime({seconds: time}));

            upd = {
                game: {
                    inRaid: true,
                    raid: {
                        created: Math.floor(moment.now() / 1000),
                        time: time,
                        wallet: wallet,
                        xp: xp,
                    }
                }
            }
            userCollection.updateOne({username: username}, {$set: upd});
        })
    }
}

module.exports.Game = Game;