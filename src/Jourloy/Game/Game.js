/* IMPORTS */
const moment = require('moment');
const { tools, error, errors } = require('../Utils/Tools');
const { Database } = require('../Utils/Database');

/* ERROR */

/* PARAMS */
const raid_information = {
    price: 1,
}

/* FUNCTIONS */

/* INTERVALS */

/* CLASSES */

class Game {
    static help() {
        return '';
    }
 
    static toRaid(username, client) {
        const user = Database.get.game(username);
        const hero = Database.get.hero(username);
        if (user === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        if (user.fraction === '') return errors.ERR_USER_NOT_IN_FRACTION;
        if (user.information.inRaid === true) return errors.ERR_ALREADY_IN_RAID;
        if (user.information.inRest === true) return errors.ERR_USER_IN_REST;
        if (user.hero.wallet < raid_information.price) return errors.ERR_NOT_ENOUGH_SHARDS;
        Database.remove.shards(username, raid_information.price);

        // TODO LUCKY
        let lucky = 100;

        let time = null;
        if (hero.level <= 1) time = tools.randomInt(1, 2) * 3600;
        else if (hero.level === 2) time = tools.randomInt(2, 3) * 3600;
        else if (hero.level === 3) time = tools.randomInt(3, 4) * 3600;
        else if (hero.level === 4) time = tools.randomInt(4, 5) * 3600;
        else if (hero.level >= 5) time = tools.randomInt(5, 6) * 3600;
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
        } else if (hours === 6) {
            shards = tools.randomInt(13, 19);
            xp = tools.randomInt(20, 28);
            hp = 0;
        }

        const startRaid = Database.get.game(username);

        if (startRaid.fraction === 'R') client.say(client.channel, `@${username}, смирно! У тебя боевая задача, вперед на выполнение. Вернешься через ${formatted}`);
        if (startRaid.fraction === 'V') client.say(client.channel, `@${username}, встретимся в вальгалле. Не бойся ни кого и помни: нет добычи - нет награды. Ты вернешься через ${formatted}`);
        if (startRaid.fraction === 'J') client.say(client.channel, `@${username}, удачи в бою. Пусть катана сделает свое дело. Ты вернешься через ${formatted}`);

        const raid_start = setTimeout(function() {
            if (startRaid.fraction === 'R') client.say(client.channel, `@${username}, боевая задача успешно выполнена! В награду выдаем тебе ${shards} купюр и ${xp} очков опыта`);
            if (startRaid.fraction === 'V') client.say(client.channel, `@${username}, посмотрите кто пришел, хахаха. Присаживайся и выпей с нами! Держи ${shards} золотых монет и ${xp} очков опыта`);
            if (startRaid.fraction === 'J') client.say(client.channel, `@${username}, рады видеть тебя. Пройдем выпьем чаю, а пока в награду мы выдаем тебе ${shards} слитков Великой стали и ${xp} очков опыта`);

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
module.exports.Game = Game;