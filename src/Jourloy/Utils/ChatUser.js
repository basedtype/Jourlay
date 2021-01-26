/* IMPORTS */
const { JsonDB } = require('node-json-db');
const { client } = require('../modules/twitch');

/* PARAMS */
const database = new JsonDB('Data/Users', true, true, '/');

/* ERRORS */
const ERR_NOT_FIND_USER = 'ERR_NOT_FIND_USER';
const ERR_USER_ALREADY_EXIST = 'ERR_USER_ALREADY_EXIST';

/* CODE */
try { database.getData('/Users') } 
catch { database.push('/Users', {}, true) }

/* CLASSES */
class ChatUser {
    static create(username, userstate) {
        const db = database.getData('/Users');
        const user = {
            twitchUsername: username,
            discordUsername: undefined,
            id: userstate['id'],
            messages: 0,
            warnings: 0,
            timers: {
                ask: 0,
                pc: 0,
                bigBrain: 0,
                roulette: 0,
                resetMessage: 0,
            },
            counters: {
                followerAge: 0,
                roulette: 0,
            },
            raid: {
                bool: false,
                rest: false,
                created_at: null,
                fail: false,
                invMax: 10,
            },
            exp: {
                level: 1,
                points: 0,
            },
            wallet: 10,
            inv: [],
        }
        db[username] = user;
        database.push('/Users', db);
    }

    static getUser(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i];
        return ERR_NOT_FIND_USER;
    }

    static getTimers(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i].timers;
        return ERR_NOT_FIND_USER;
    }

    static getCounters(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i].counters;
        return ERR_NOT_FIND_USER;
    }

    static getRaid(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i].raid;
        return ERR_NOT_FIND_USER;
    }

    static getExp(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i].exp;
        return ERR_NOT_FIND_USER;
    }

    static addMessage(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].messages++;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static addWarning(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].warnings++;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static addExp(username, exp, client) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].exp.points += exp;
            if (db[username].exp.points > ((db[username].exp.level * 100) + (db[username].exp.level * 10))) {
                db[username].exp.level++;
                db[username].exp.points = db[username].exp.points - ((db[username].exp.level * 100) + (db[username].exp.level * 10));
                client.say(client.channel, `@${username}, поздравляю, ты достиг ${db[username].exp.level} уровня!`);
            }
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateTimers(username, timers) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].timers = timers;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateCounetrs(username, counters) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].counters = counters;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateRaid(username, raid) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].raid = raid;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateExp(username, exp) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].exp = exp;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static deleteUser(username) {
        const db = database.getData('/Users');
        delete db[username];
        database.push('/Users', db, true);
        return ERR_NOT_FIND_USER;
    }
}

/* EXPORTS */
module.exports.ChatUser = ChatUser;