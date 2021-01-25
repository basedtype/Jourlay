/* IMPORTS */
const { JsonDB } = require('node-json-db');

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
                created_at: null,
                fail: false,
                invMax: 3,
            }
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

    static getCounters(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i].raid;
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

    static updateTimers(username, timers) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].timers = timers;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateTimers(username, counters) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].counters = counters;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateTimers(username, raid) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].raid = raid;
            database.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }
}

/* EXPORTS */
module.exports.ChatUser = ChatUser;