/* IMPORTS */
const moment = require('moment');
const { tools, error, errors } = require('../Utils/Tools');
const { Database } = require('../Utils/Database');

/* ERROR */

/* PARAMS */
const raid_information = {
    price: 1,
}
const send = {};

/* FUNCTIONS */

/* INTERVALS */

/* CODE */

/* CLASSES */

class TwitchGame {
    static help() {
        return '';
    }

    static send() {
        return send;
    }

    static repair(client) {
        const data = Database.get.db();
        for (let i in data) {
            if (data[i].game.information.inRaid === true) {
                const reward = data[i].game.information.raid.reward;
                const now = Math.floor(moment.now() / 1000);
                const created_at = data[i].game.information.raid.created;
                const time = data[i].game.information.raid.time;
                
                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60
                if (about < 10) {
                    const endRaid = Database.get.game(i);
                    endRaid.information.inRaid = false;
                    endRaid.information.raid.created = 0;
                    endRaid.information.raid.time = 0;
                    endRaid.information.raid.reward.shards = 0;
                    endRaid.information.raid.reward.xp = 0;
                    endRaid.information.timerID = null;
                    Database.update.game(i, endRaid);
                    Database.add.shards(i, reward.shards);
                    Database.add.xp(i, reward.xp);

                    const startRaid = Database.get.game(i);
                    send[i] = {};
                    send[i].message = '';
                    if (startRaid.fraction === 'C') send[i].message = `@${i}, task is done, "Caesar" fighter! Your reward is ${reward.shards} bills and ${reward.xp} experience points`;
                    if (startRaid.fraction === 'V') send[i].message = `@${i}, look who came, hahaha. Sit down and drink with us, viking! Take ${reward.shards} gold coins and ${reward.xp} experience points`;
                    if (startRaid.fraction === 'J') send[i].message = `@${i}, glad to see you, samurai. Go drink a tea, and now I give you ${reward.shards} Great steel ingots and ${reward.xp} experience points`;
                    if (startRaid.fraction === 'K') send[i].message = `@${i}, thank you, soul master, I give ${reward.shards} soul shards and ${reward.xp} experience points`;
                    console.log(`Twitch => Jourloy_bot => Game => End raid => ${i} => shards: ${reward.shards} | xp: ${reward.xp}`);
                } else {
                    const startRaid = Database.get.game(i);
                    const raid_start = setTimeout(function() {
                        send[i] = {};
                        send[i].message = '';
                        if (startRaid.fraction === 'C') send[i].message = `@${i}, task is done, "Caesar" fighter! Your reward is ${reward.shards} bills and ${reward.xp} experience points`;
                        if (startRaid.fraction === 'V') send[i].message = `@${i}, look who came, hahaha. Sit down and drink with us, viking! Take ${reward.shards} gold coins and ${reward.xp} experience points`;
                        if (startRaid.fraction === 'J') send[i].message = `@${i}, glad to see you, samurai. Go drink a tea, and now I give you ${reward.shards} Great steel ingots and ${reward.xp} experience points`;
                        if (startRaid.fraction === 'K')send[i].message = `@${i}, thank you, soul master, I give ${reward.shards} soul shards and ${reward.xp} experience points`;
                        console.log(`Twitch => Jourloy_bot => Game => End raid => ${i} => shards: ${reward.shards} | xp: ${reward.xp}`);
    
                        const endRaid = Database.get.game(i);
                        endRaid.information.inRaid = false;
                        endRaid.information.raid.created = 0;
                        endRaid.information.raid.time = 0;
                        endRaid.information.raid.reward.shards = 0;
                        endRaid.information.raid.reward.xp = 0;
                        endRaid.information.timerID = null;
                        Database.update.game(i, endRaid);
    
                        Database.add.shards(i, reward.shards);
                        Database.add.xp(i, reward.xp);
    
                    }, tools.convertTime({seconds: about}));
    
                    startRaid.information.inRaid = true;
                    startRaid.information.raid.reward.shards = reward.shards;
                    startRaid.information.raid.reward.xp = reward.xp;
                    startRaid.information.timerID = raid_start + " !";
                    Database.update.game(i, startRaid);
                    console.log(`Game => ${i} => Retunr to raid`)
                }
            }
        }
    }
 
    static toRaid(username, client) {
        const user = Database.get.game(username);
        const hero = Database.get.hero(username);
        if (user === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        if (user.fraction === '') return errors.ERR_USER_NOT_IN_FRACTION;
        if (user.information.inRaid === true) return errors.ERR_ALREADY_IN_RAID;
        if (user.information.inRest === true) return errors.ERR_USER_IN_REST;
        if (user.hero.wallet < raid_information.price) return errors.ERR_NOT_ENOUGH_SHARDS;
        Database.remove.wallet(username, raid_information.price);

        // TODO LUCKY
        let lucky = 100;

        let time = null;
        if (hero.level <= 1) time = tools.randomInt(1, 2) * tools.randomInt(3600, 5000);
        else if (hero.level === 2) time = tools.randomInt(2, 3) * tools.randomInt(3600, 5000);
        else if (hero.level === 3) time = tools.randomInt(3, 4) * tools.randomInt(3600, 5000);
        else if (hero.level === 4) time = tools.randomInt(4, 5) * tools.randomInt(3600, 5000);
        else if (hero.level >= 5) time = tools.randomInt(5, 6) * tools.randomInt(3600, 5000);
        if (username === 'jourloy') time = 30;

        let hours = Math.floor(time/60/60);
        let minutes = Math.floor(time/60)-(hours*60);
        let seconds = time%60

        const formatted = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');

        let shards = null;
        let xp = null;
        let hp = null;
        if (hours <= 1) {
            shards = tools.randomInt(1, 2);
            xp = tools.randomInt(1, 10);
            hp = 0;
        } else if (hours === 2) {
            shards = tools.randomInt(3, 5);
            xp = tools.randomInt(5, 15);
            hp = 0;
        } else if (hours === 3) {
            shards = tools.randomInt(5, 9);
            xp = tools.randomInt(10, 19);
            hp = 0;
        } else if (hours === 4) {
            shards = tools.randomInt(8, 12);
            xp = tools.randomInt(15, 23);
            hp = 0;
        } else if (hours === 5) {
            shards = tools.randomInt(10, 15);
            xp = tools.randomInt(18, 25);
            hp = 0;
        } else if (hours >= 6) {
            shards = tools.randomInt(13, 19);
            xp = tools.randomInt(20, 28);
            hp = 0;
        }

        const startRaid = Database.get.game(username);

        if (startRaid.fraction === 'C') client.say(client.channel, `@${username}, attention, "Caesar" fighter! I have a task for you. You will come back in ${formatted}`);
        if (startRaid.fraction === 'V') client.say(client.channel, `@${username}, will meet in Valhalla, viking. Don't fear anyone and remember: don't have loot - don't have reward. You will come back in ${formatted}`);
        if (startRaid.fraction === 'J') client.say(client.channel, `@${username}, good luck in fight, samurai. Let katana do that, for what it. You will come back in ${formatted}`);
        if (startRaid.fraction === 'K') client.say(client.channel, `@${username}, need steal couple documents, soul master. You will come back in ${formatted}`);
        console.log(`Twitch => Jourloy_bot => Game => Start raid => ${username} => ${formatted}`);

        const raid_start = setTimeout(function() {
            if (startRaid.fraction === 'C') client.say(client.channel, `@${username}, task is done, "Caesar" fighter! Your reward is ${shards} bills and ${xp} experience points`);
            if (startRaid.fraction === 'V') client.say(client.channel, `@${username}, look who came, hahaha. Sit down and drink with us, viking! Take ${shards} gold coins and ${xp} experience points`);
            if (startRaid.fraction === 'J') client.say(client.channel, `@${username}, glad to see you, samurai. Go drink a tea, and now I give you ${shards} Great steel ingots and ${xp} experience points`);
            if (startRaid.fraction === 'K') client.say(client.channel, `@${username}, thank you, soul master, I give ${shards} soul shards and ${xp} experience points`);
            console.log(`Twitch => Jourloy_bot => Game => End raid => ${username} => shards: ${shards} | xp: ${xp}`);

            const endRaid = Database.get.game(username);
            endRaid.information.inRaid = false;
            endRaid.information.raid.created = 0;
            endRaid.information.raid.time = 0;
            endRaid.information.raid.reward.shards = 0;
            endRaid.information.raid.reward.xp = 0;
            endRaid.information.timerID = null;
            Database.update.game(username, endRaid);

            Database.add.shards(username, shards);
            Database.add.xp(username, xp);

        }, tools.convertTime({seconds: time}))

        startRaid.information.inRaid = true;
        startRaid.information.raid.created = Math.floor(moment.now() / 1000);
        startRaid.information.raid.time = time;
        startRaid.information.raid.reward.shards = shards;
        startRaid.information.raid.reward.xp = xp;
        startRaid.information.timerID = raid_start + " !";
        Database.update.game(username, startRaid);
    }
}

class DiscordGame {
    static send() {
        return send;
    }

    static repair() {
        const data = Database.get.db();
        for (let i in data) {
            if (data[i].game.information.inRaid === true) {
                const reward = data[i].game.information.raid.reward;
                const now = Math.floor(moment.now() / 1000);
                const created_at = data[i].game.information.raid.created;
                const time = data[i].game.information.raid.time;
                
                let about = Math.floor((created_at + time) - now);
                let hours = Math.floor(about/60/60);
                let minutes = Math.floor(about/60)-(hours*60);
                let seconds = about%60
                if (about < 1) {
                    const endRaid = Database.get.game(i);
                    endRaid.information.inRaid = false;
                    endRaid.information.raid.created = 0;
                    endRaid.information.raid.time = 0;
                    endRaid.information.raid.reward.shards = 0;
                    endRaid.information.raid.reward.xp = 0;
                    endRaid.information.timerID = null;
                    Database.update.game(i, endRaid);
                    Database.add.shards(i, reward.shards);
                    Database.add.xp(i, reward.xp);

                    const startRaid = Database.get.game(i);
                    send[i] = {};
                    send[i].message = '';
                    if (startRaid.fraction === 'C') send[i].message = `@${i}, task is done, "Caesar" fighter! Your reward is ${reward.shards} bills and ${reward.xp} experience points`;
                    if (startRaid.fraction === 'V') send[i].message = `@${i}, look who came, hahaha. Sit down and drink with us, viking! Take ${reward.shards} gold coins and ${reward.xp} experience points`;
                    if (startRaid.fraction === 'J') send[i].message = `@${i}, glad to see you, samurai. Go drink a tea, and now I give you ${reward.shards} Great steel ingots and ${reward.xp} experience points`;
                    if (startRaid.fraction === 'K') send[i].message = `@${i}, thank you, soul master, I give ${reward.shards} soul shards and ${reward.xp} experience points`;
                } else {
                    const formatted = [
                        hours.toString().padStart(2, '0'),
                        minutes.toString().padStart(2, '0'),
                        seconds.toString().padStart(2, '0')
                    ].join(':');
                    
                    const startRaid = Database.get.game(i);
                    const raid_start = setTimeout(function() {
                        if (startRaid.fraction === 'C') send[i].message = `@${i}, task is done, "Caesar" fighter! Your reward is ${reward.shards} bills and ${reward.xp} experience points`;
                        if (startRaid.fraction === 'V') send[i].message = `@${i}, look who came, hahaha. Sit down and drink with us, viking! Take ${reward.shards} gold coins and ${reward.xp} experience points`;
                        if (startRaid.fraction === 'J') send[i].message = `@${i}, glad to see you, samurai. Go drink a tea, and now I give you ${reward.shards} Great steel ingots and ${reward.xp} experience points`;
                        if (startRaid.fraction === 'K') send[i].message = `@${i}, thank you, soul master, I give ${reward.shards} soul shards and ${reward.xp} experience points`;
    
                        const endRaid = Database.get.game(i);
                        endRaid.information.inRaid = false;
                        endRaid.information.raid.created = 0;
                        endRaid.information.raid.time = 0;
                        endRaid.information.raid.reward.shards = 0;
                        endRaid.information.raid.reward.xp = 0;
                        endRaid.information.timerID = null;
                        Database.update.game(i, endRaid);
    
                        Database.add.shards(i, reward.shards);
                        Database.add.xp(i, reward.xp);
    
                    }, tools.convertTime({seconds: about}));
    
                    startRaid.information.inRaid = true;
                    startRaid.information.raid.reward.shards = reward.shards;
                    startRaid.information.raid.reward.xp = reward.xp;
                    startRaid.information.timerID = raid_start + " !";
                    Database.update.game(i, startRaid);
                    console.log(`Game => ${i} => Retunr to raid`)
                }
            }
        }
    }

    static toRaid(username, channel) {
        const user = Database.get.game(username);
        const hero = Database.get.hero(username);
        if (user === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        if (user.fraction === '') return errors.ERR_USER_NOT_IN_FRACTION;
        if (user.information.inRaid === true) return errors.ERR_ALREADY_IN_RAID;
        if (user.information.inRest === true) return errors.ERR_USER_IN_REST;
        if (user.hero.wallet < raid_information.price) return errors.ERR_NOT_ENOUGH_SHARDS;
        Database.remove.wallet(username, raid_information.price);

        // TODO LUCKY
        let lucky = 100;

        let time = null;
        if (hero.level <= 1) time = tools.randomInt(1, 2) * tools.randomInt(3600, 5000);
        else if (hero.level === 2) time = tools.randomInt(2, 3) * tools.randomInt(3600, 5000);
        else if (hero.level === 3) time = tools.randomInt(3, 4) * tools.randomInt(3600, 5000);
        else if (hero.level === 4) time = tools.randomInt(4, 5) * tools.randomInt(3600, 5000);
        else if (hero.level >= 5) time = tools.randomInt(5, 6) * tools.randomInt(3600, 5000);
        if (username === 'jourloy') time = 30;

        let hours = Math.floor(time/60/60);
        let minutes = Math.floor(time/60)-(hours*60);
        let seconds = time%60

        const formatted = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');

        let shards = null;
        let xp = null;
        let hp = null;
        if (hours <= 1) {
            shards = tools.randomInt(1, 2);
            xp = tools.randomInt(1, 10);
            hp = 0;
        } else if (hours === 2) {
            shards = tools.randomInt(3, 5);
            xp = tools.randomInt(5, 15);
            hp = 0;
        } else if (hours === 3) {
            shards = tools.randomInt(5, 9);
            xp = tools.randomInt(10, 19);
            hp = 0;
        } else if (hours === 4) {
            shards = tools.randomInt(8, 12);
            xp = tools.randomInt(15, 23);
            hp = 0;
        } else if (hours === 5) {
            shards = tools.randomInt(10, 15);
            xp = tools.randomInt(18, 25);
            hp = 0;
        } else if (hours >= 6) {
            shards = tools.randomInt(13, 19);
            xp = tools.randomInt(20, 28);
            hp = 0;
        }

        const startRaid = Database.get.game(username);

        if (startRaid.fraction === 'C') channel.send(`@${username}, attention, "Caesar" fighter! I have a task for you. You will come back in ${formatted}`);
        if (startRaid.fraction === 'V') channel.send(`@${username}, will meet in Valhalla, viking. Don't fear anyone and remember: don't have loot - don't have reward. You will come back in ${formatted}`);
        if (startRaid.fraction === 'J') channel.send(`@${username}, good luck in fight, samurai. Let katana do that, for what it. You will come back in ${formatted}`);
        if (startRaid.fraction === 'K') channel.send(`@${username}, need steal couple documents, soul master. You will come back in ${formatted}`);

        const raid_start = setTimeout(function() {
            if (startRaid.fraction === 'C') channel.send(`@${username}, task is done, "Caesar" fighter! Your reward is ${shards} bills and ${xp} experience points`);
            if (startRaid.fraction === 'V') channel.send(`@${username}, look who came, hahaha. Sit down and drink with us, viking! Take ${shards} gold coins and ${xp} experience points`);
            if (startRaid.fraction === 'J') channel.send(`@${username}, glad to see you, samurai. Go drink a tea, and now I give you ${shards} Great steel ingots and ${xp} experience points`);
            if (startRaid.fraction === 'K') channel.send(`@${username}, thank you, soul master, I give ${shards} soul shards and ${xp} experience points`);

            const endRaid = Database.get.game(username);
            endRaid.information.inRaid = false;
            endRaid.information.raid.created = 0;
            endRaid.information.raid.time = 0;
            endRaid.information.raid.reward.shards = 0;
            endRaid.information.raid.reward.xp = 0;
            endRaid.information.timerID = null;
            Database.update.game(username, endRaid);

            Database.add.shards(username, shards);
            Database.add.xp(username, xp);

        }, tools.convertTime({seconds: time}))

        startRaid.information.inRaid = true;
        startRaid.information.raid.created = Math.floor(moment.now() / 1000);
        startRaid.information.raid.time = time;
        startRaid.information.raid.reward.shards = shards;
        startRaid.information.raid.reward.xp = xp;
        startRaid.information.timerID = raid_start + " !";
        Database.update.game(username, startRaid);
    }
}

/* EXPORTS */
module.exports.Game = TwitchGame;
module.exports.TwitchGame = TwitchGame;
module.exports.DiscordGame = DiscordGame;