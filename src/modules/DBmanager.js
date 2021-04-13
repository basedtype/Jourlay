/* IMPORTS */
const DBexamples = require('./DBexamples');
const { colors } = require('./colors');
const { MongoClient } = require("mongodb");
const moment = require('moment');

/* PARAMS */
const uri = "mongodb://192.168.0.100:12702/";
const clientDB = new MongoClient(uri, { useUnifiedTopology: true });
let usersCollection = null;
let twitchCollection = null;

/* CODE */
clientDB.connect().then(err => {
    database = clientDB.db('Nidhoggbot');
    usersCollection = database.collection('users');
    twitchCollection = database.collection('twitch');
    configCollection = database.collection('config');
    poolCollection = database.collection('pool');
    giveawaysCollection = database.collection('giveaways');
    namUsersCollection = database.collection('NAMVSEYASNO_users');
    namGiveCollection = database.collection('NAMVSEYASNO_giveaways');
})

/* CLASSES */
class DBmanager {
    /**
     * Add second in user watchtime
     * @param {string} username 
     */
    static _twitchAddWatchtime(username, channel) {
        if (usersCollection == null) return 'collection is undefined';
        usersCollection.findOne({ username: username, channel: channel }).then(user => {
            if (user == null) {
                const docs = DBexamples.global.user;
                docs.username = username;
                docs.channel = channel;
                usersCollection.insertOne(docs);
                return true;
            }
            user.twitch.watchtime++;
            usersCollection.findOneAndUpdate({ username: username, channel: channel }, { $set: user });
        })
        return true;
    }

    /**
     * Add one warning for user
     * @param {string} username 
     * @param {string} sender 
     */
    static _twitchAddWarning(username, sender, reason) {
        if (usersCollection == null) return 'collection is undefined';
        usersCollection.findOne({ username: username }).then(user => {
            if (user.defence.warnings == null) user.defence.warnings = [];
            const warn = {
                created: moment.now(),
                sender: sender,
                reason: reason,
            }
            user.defence.warnings.push(warn);
            usersCollection.findOneAndUpdate({ username: username }, { $set: user });
        });
        return true;
    }

    /**
     * Add word in delete list
     * @param {string} username Channel name
     * @param {string} word 
     * @param {string} sender 
     */
    static _twitchAddDeleteWord(username, word, sender) {
        if (twitchCollection == null) return 'collection is undefined';
        twitchCollection.findOne({ username: username }).then(channel => {
            if (channel.defence.deleteWords == null) channel.defence.deleteWords = [];
            const deleteWord = {
                created: moment.now(),
                sender: sender,
            }
            channel.defence.deleteWords.push(deleteWord);
            twitchCollection.findOneAndUpdate({ username: username }, { $set: channel });
        });
        return true;
    }

    /**
     * 
     * @param {string} username 
     * @param {string} type 
     * @param {string} oauth 
     * @returns 
     */
    static _configAddBot(username, type, oauth) {
        if (configCollection == null) return 'collection is undefined';
        if (username == null) username = '';
        if (type == null) return 'Need <type> for bot'
        if (oauth == null) return 'Need <oauth> for bot'
        const docs = DBexamples.config.bot;
        docs.username = username;
        docs.type = type;
        docs.oauth = oauth;
        configCollection.insertOne(docs)
        return true;
    }

    /**
     * 
     * @param {{
     *     msgID: string,
     *     amount: number,
     *     length: number,
     *     end: number,
     *     created: number,
     *     people: [],
     *     urlTitle: string,
     *     urlImage: string,
     *     title: string,
     *     authorUsername: string,
     *     authorURL: function()
     * }} give 
     */
    static _giveawayAdd(owner, give) {
        if (owner == null) return false;
        if (give == null) return false;
        give.owner = owner;
        giveawaysCollection.insertOne(give);
        return true;
    }

    static async _giveawayGet(owner) {
        if (owner == null) return false;
        const giveaways = await giveawaysCollection.find({owner: owner})
        return giveaways;
    }

    /**
     * 
     * @param {string} owner 
     * @param {string} id msgID
     * @returns 
     */
    static _giveawayRemove(owner, id) {
        if (owner == null) return false;
        if (id == null) return false;
        giveawaysCollection.findOneAndDelete({msgID: id});
        return true;
    }

    /**
     * Add new block in pool
     * @param {string} type 
     * @param {string} destination 
     * @param {} data 
     * @param {number} priority 
     * @returns 
     */
    static _poolAddBlock(type, owner, doing) {
        const block = DBexamples.pool.block;
        block.type = type,
            block.owner = owner;
        block.do = doing;
        poolCollection.insertOne(block);
        return true;
    }
}

/* EXPORTS */
module.exports.DBmanager = DBmanager;