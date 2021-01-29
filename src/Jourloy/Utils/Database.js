/* IMPORTS */
const { JsonDB } = require('node-json-db');

/* PARAMS */
const database = new JsonDB('Data/Users', true, true, '/');

/* ERRORS */
const ERR_NOT_FIND_USER = 'ERR_NOT_FIND_USER';
const ERR_USER_ALREADY_EXIST = 'ERR_USER_ALREADY_EXIST';

/* CODE */
try { 
    const data = database.getData('/Users');
} 
catch { database.push('/Users', {}, true) }

/* CLASSES */
class Database {
    static create(username, userstate, client) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
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
            },
            counters: {
                followerAge: 0,
                roulette: 0,
            },
            raid: {
                bool: false,
                rest: false,
                created_at: null,
                time: null,
                fail: false,
                invMax: 10,
            },
            exp: {
                level: 1,
                points: 0,
            },
            chatDefence: {
                messages: 0,
                timer: 0,
            },
            wallet: 10,
            inv: [],
        }
        db[username] = user;
        database.push('/Users', db);
        //client.say(client.channel, `@${username}, вам создан счет в ДжапанБанке, где вы можете хранить свои осколки душ. Проверить баланс счета можно командой !wallet. Спасибо, что используете ДжапанБанк`)
    }

    static getUser(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i];
        return ERR_NOT_FIND_USER;
    }

    static getTimers(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].timers;
        return ERR_NOT_FIND_USER;
    }

    static getCounters(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].counters;
        return ERR_NOT_FIND_USER;
    }

    static getRaid(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].raid;
        return ERR_NOT_FIND_USER;
    }

    static getExp(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].exp;
        return ERR_NOT_FIND_USER;
    }

    static getCoins(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].wallet;
        return ERR_NOT_FIND_USER;
    }

    static getChatDefence(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].chatDefence;
        return ERR_NOT_FIND_USER;
    }

    static getInventory(username) {
        // TODO
    }

    static getTop() {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');

        let maxWallet = 0
        let user = '';

        for (i in db) {
            if (db[i].wallet > maxWallet) {
                maxWallet = db[i].wallet;
                user = i;
            }
        }

        return {username: user, wallet: maxWallet};
    }

    static addMessage(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].messages++;
            db[username].chatDefence.messages++;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static addWarning(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].warnings++;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    /**
     * 
     * @param {String} username 
     * @param {Number} exp 
     * @param {{}} client 
     */
    static addExp(username, exp, client) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].exp.points += exp;
            if (db[username].exp.points > ((db[username].exp.level * 100) + (db[username].exp.level * 10))) {
                db[username].exp.level++;
                db[username].exp.points = db[username].exp.points - ((db[username].exp.level * 100) + (db[username].exp.level * 10));
                client.say(client.channel, `@${username}, поздравляю, ты достиг ${db[username].exp.level} уровня!`);
            }
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static addCoins(username, amount) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].wallet += amount;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static addInventory(username, thing, amount = 1) {
        // TODO
    }

    static updateTimers(username, timers) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].timers = timers;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateCounters(username, counters) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].counters = counters;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateRaid(username, raid) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].raid = raid;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateExp(username, exp) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].exp = exp;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static deleteUser(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        delete db[username];
        data.push('/Users', db, true);
        return ERR_NOT_FIND_USER;
    }

    static removeCoins(username, amount) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].wallet -= amount;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static removeInventory(username, thing, amount) {
        //TODO
    }

    static resetMessage(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].chatDefence.messages = 0;
            db[username].chatDefence.timer = 0;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }
}

/* EXPORTS */
module.exports.Database = Database;