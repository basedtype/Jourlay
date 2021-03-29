/* IMPORTS */
const { client } = require("./bots/twitch");
const DBexamples = require('./DBexamples');
const { MongoClient } = require("mongodb");
const moment = require('moment');

/* PARAMS */
const uri = "mongodb://192.168.0.100:12702/";
const clientDB = new MongoClient(uri);
let usersCollection = null;
let twitchCollection = null;

/* CODE */
clientDB.connect().then(err => {
    const database = clientDB.db('DragonBot');
    usersCollection = database.collection('users');
    twitchCollection = database.collection('twitch');
})

/* CLASSES */
class DBmanager {
    static twitch = {
        addWatchtime: this._twitchAddWatchtime(username),
        addWarning: this._twitchAddWarning(username, sender),
        addDeleteWord: this._twitchAddDeleteWord(word, sender),
    }
    static discord = {

    }
    static global = {

    }

    /**
     * Add second in user watchtime
     * @param {string} username 
     */
    static _twitchAddWatchtime(username) {
        if (usersCollection == null) return;
        usersCollection.findOne({ username: username }).then(user => {
            if (user == null) {
                const docs = DBexamples.twitch.user;
                docs.username = username;
                usersCollection.insertOne(docs);
                return;
            }
            user.twitch.watchtime++;
            usersCollection.findOneAndUpdate({ username: username }, { $set: user });
            return;
        })
    }

    /**
     * Add one warning for user
     * @param {string} username 
     * @param {string} sender 
     */
    static _twitchAddWarning(username, sender, reason) {
        usersCollection.findOne({ username: username }).then(user => {
            if (user.defence.warnings == null) user.defence.warnings = [];
            const warn = {
                created: moment.now(),
                sender: sender,
                reason: reason,
            }
            user.defence.warnings.push(warn);
            usersCollection.findOneAndUpdate({ username: username }, { $set: user });
            return;
        });
    }

    /**
     * Add word in delete list
     * @param {string} word 
     * @param {string} sender 
     */
    static _twitchAddDeleteWord(word, sender) {
        twitchCollection.findOne({ username: username }).then(channel => {
            if (channel.defence.deleteWords == null) channel.defence.deleteWords = [];
            const deleteWord = {
                created: moment.now(),
                sender: sender,
            }
            channel.defence.deleteWords.push(deleteWord);
            twitchCollection.findOneAndUpdate({ username: username }, { $set: channel });
            return;
        });
    }
}

/* EXPORTS */
module.exports.DBmanager = DBmanager;