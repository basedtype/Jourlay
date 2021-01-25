/* IMPORTS */
const { JsonDB } = require('node-json-db');

/* PARAMS */
const database = new JsonDB('Data/Users', true, true, '/');
const name = 'Осколки души';

/* ERRORS */
const ERR_NOT_FIND_USER = 'ERR_NOT_FIND_USER';
const ERR_USER_ALREADY_EXIST = 'ERR_USER_ALREADY_EXIST';

/* CODE */
try { database.getData('/Users') } 
catch { database.push('/Users', {}, true) }

/* CLASSES */
class Coins {
    static help(client) {
        client.action(client.channel, `==> учавствуя в мини-играх и просто общаясь в чате, ты получаешь на свой счет в ДжапанБанке "осколки душ". Их можно тратить на награды и участие в платных мини-играх. Они отличаются от йен только способом получения. В будущем йены можно будет конвентировать в осколки душ`);
        return true;
    }

    /**
     * 
     * @param {String} username 
     */
    static getAmount(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return db[i];
        return ERR_NOT_FIND_USER;
    }

    static addUser(username) {
        const db = database.getData('/Users');
        for (let i in db) if (i === username) return ERR_USER_ALREADY_EXIST;

        const user = {
            username: username,
            messages: 0,
            warnings: 0,
            coins: 0,
        }

        db[username] = user;
        database.push('/Users', db, true);
        return true;
    }

    static plusCoins(username, amount) {
        const db = database.getData('/Users');
        let user = undefined;
        for (let i in db) if (i === username) user = db[i];
        if (user == null) return ERR_NOT_FIND_USER;

        db[username].coins += amount;
        database.push('/Users', db, true);
        return true;
    }

    static minusCoins(username, amount) {
        const db = database.getData('/Users');
        let user = undefined;
        for (let i in db) if (i === username) user = db[i];
        if (user == null) return ERR_NOT_FIND_USER;

        db[username].coins -= amount;
        database.push('/Users', db, true);
        return true;
    }
}

/* EXPORTS */
module.exports.Coins = Coins;