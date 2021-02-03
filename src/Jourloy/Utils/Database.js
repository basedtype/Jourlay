/* IMPORTS */
const { JsonDB } = require('node-json-db');
const { tools, errors } = require('../Utils/Tools');

/* PARAMS */
const user_example = {
    chatDefence: {
        messages: 0,
        timer: 0,
        warnings: 0,
        counters: {
            followerAge: 0,
            roulette: 0,
        }
    },
    timers: {
        ask: 0,
        pc: 0,
        bigBrain: 0,
        roulette: 0,
        followerAge: 0,
    },
    game: {
        fraction: '',
        hero: {
            hp: 100,
            xp: 0,
            level: 1,
            wallet: 1,
            pay: 0,
            inventory: [],
            inventoryLimit: 5,
        },
        counters: {
            toRaid: 0,
            spend: 0,
            return: 0,
        },
        information: {
            inRaid: false,
            inRest: false,
            timerID: undefined,
            raid: {
                created: 0,
                time: 0,
                return: {
                    inReturn: false,
                    pay: 0,
                },
                reward: {
                    shards: 0,
                    xp: 0,
                }
            }
        }
    }
};

const channel_example = {
    channelID: '',
    channelName: '',
    rollGame: [],
    game: {
        allowRaid: true,
        allowStocks: true,
    },
    chatDefence: {
        ban: [],
        timeout: [],
        delete: [],
    }
}

const items = {
    'katana': {
        fraction: ['samurai'],
        levels: {
            '1': {
                lucky: 2,
                price: 10,
            },
            '2': {
                lucky: 4,
                price: 21,
            },
            '3': {
                lucky: 6,
                price: 42,
            },
            '4': {
                lucky: 8,
                price: 84,
            },
        }
    }
}

/* CODE */
try { const data = new JsonDB('Data/Users', true, true, '/') } 
catch { 
    const data = new JsonDB('Data/Users', true, true, '/') 
    data.push('/Users', {}, true) 
}

/* CLASSES 
class Database {
    static create(username, userstate) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        user.username = username;
        user.id = userstate['user-id'];
        db[username] = user;
        data.push('/Users', db);
        //client.say(client.channel, `@${username}, вам создан счет в ДжапанБанке, где вы можете хранить свои осколки душ. Проверить баланс счета можно командой !wallet. Спасибо, что используете ДжапанБанк`)
    }

    static getExp(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].exp;
        return ERR_NOT_FIND_USER;
    }

    static getTop() {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');

        let maxWallet = 0
        let user = '';

        for (let i in db) {
            if (db[i].wallet > maxWallet) {
                maxWallet = db[i].wallet;
                user = i;
            }
        }

        return {username: user, wallet: maxWallet};
    }

    static getBets() {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');

        const bets = {};

        for (let i in db) {
            if (db[i].bet.join === true) {
                bets[i] = {};
                bets[i].amount = db[i].bet.amount;
            }
        }

        return bets;
    }

    static getBet(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].bet;
        return ERR_NOT_FIND_USER;
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
     *
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

    static updateExp(username, exp) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].exp = exp;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateBet(username, bet) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].bet = bet;
            data.push('/Users', db, true);
        }
        return ERR_NOT_FIND_USER;
    }

    static updateChatDefence(username, chatDefence) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].chatDefence = chatDefence;
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
} */

class get {
    static user(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i];
        return errors.ERR_NOT_FIND_USER;
    }

    static timers(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].timers;
        return errors.ERR_NOT_FIND_USER;
    }

    static chatDefence(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].chatDefence;
        return errors.ERR_NOT_FIND_USER;
    }

    static counters(username) {
        const chatDefence = this.chatDefence(username);
        if (chatDefence === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        else return chatDefence.counters;
    }

    static game(username) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) return db[i].game;
        return errors.ERR_NOT_FIND_USER;
    }

    static hero(username) {
        const game = get.game(username);
        if (game === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        else return game.hero;
    }

    static raid(username) {
        const game = get.game(username);
        if (game === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        else return game.information;
    }

    static wallet(username) {
        const hero = get.hero(username);
        if (hero === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        else return hero.wallet;
    }
}

class add {
    static user(username, fraction) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        user_example.game.fraction = fraction;
        db[username] = user_example;
        data.push('/Users', db);
    }

    static shards(username, amount) {
        const hero = get.hero(username);
        if (hero === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        hero.wallet += amount;
        update.hero(username, hero);
        return true;
    }

    static xp(username, amount) {
        const hero = get.hero(username);
        if (hero === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        hero.xp += amount;
        update.hero(username, hero);
        return true;
    }
}

class update {
    static game(username, game) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].game = game;
            data.push('/Users', db, true);
            return true;
        }
        return errors.ERR_NOT_FIND_USER;
    }

    static hero(username, hero) {
        const data = new JsonDB('Data/Users', true, true, '/');
        const db = data.getData('/Users');
        for (let i in db) if (i === username) {
            db[username].game.hero = hero;
            data.push('/Users', db, true);
            return true;
        }
        return errors.ERR_NOT_FIND_USER;
    }
}

class remove {
    static shards(username, amount) {
        const hero = get.hero(username);
        if (hero === errors.ERR_NOT_FIND_USER) return errors.ERR_NOT_FIND_USER;
        hero.wallet -= amount;
        update.hero(username, hero);
        return true;
    }
}

class reset {
    static messages(username) {
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
module.exports.Database = {get, add, update, remove, reset};