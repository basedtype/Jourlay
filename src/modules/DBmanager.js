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
    serverCollection = database.collection('server');
    eveCollection = database.collection('eve');
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

    /**
     * 
     * @param {string} owner 
     * @param {string} ID 
     * @param {string} type 
     * @param {{}} data 
     * @returns 
     */
    static _giveawayUpdate(owner, ID, type, data) {
        if (owner == null) return false;
        if (type == null) return false;
        if (data == null) return false;
        giveawaysCollection.findOne({owner: owner, msgID: ID}).then(give => {
            if (give == null) return;
            if (type === 'time') {
                give.end = data.end;
                give.length = data.length;
                if (data.amount != null) give.amount = data.amount;
                giveawaysCollection.findOneAndUpdate({owner: owner, msgID: ID}, {$set: give});
            } else if (type === 'amount') {
                give.amount = data.amount;
                giveawaysCollection.findOneAndUpdate({owner: owner, msgID: ID}, {$set: give});
            } else if (type === 'title') {
                give.title = data.title;
                giveawaysCollection.findOneAndUpdate({owner: owner, msgID: ID}, {$set: give});
            } else if (type === 'url') {
                give.urlTitle = data.urlTitle;
                giveawaysCollection.findOneAndUpdate({owner: owner, msgID: ID}, {$set: give});
            } else if (type === 'urlImage') {
                give.urlImage = data.urlImage;
                giveawaysCollection.findOneAndUpdate({owner: owner, msgID: ID}, {$set: give});
            }
            return;
        })
        return true;
    }

    /**
     * 
     * @param {string} owner 
     * @param {string} id msgID
     * 
     * @returns 
     */
     static _giveawayAddPeople(owner, id, userID) {
        if (owner == null) return false;
        if (id == null) return false;
        if (userID == null) return false;
        giveawaysCollection.findOne({owner: owner, msgID: id}).then(give => {
            if (give == null) return;
            if (give.people.includes(userID) === true) return;
            give.people.push(userID);
            giveawaysCollection.findOneAndUpdate({owner: owner, msgID: id}, {$set: give})
        })
        return true;
    }

    /**
     * 
     * @param {string} owner 
     * @returns 
     */
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
    static _giveawayRemove(id) {
        if (id == null) return false;
        giveawaysCollection.findOneAndDelete({msgID: id});
        return true;
    }

    /**
     * Add IP address in watchdog
     * @param {string} ip 
     * @returns 
     */
    static _serverIPAdd(ip, amount) {
        if (ip == null) return false;
        if (amount == null) amount = 1;
        serverCollection.findOne({ip: ip}).then(ipAddress => {
            if (ipAddress == null) {
                serverCollection.insertOne({ip: ip, count: amount, ban: false, description: ''});
                return true;
            } else {
                ipAddress.count += amount;
                serverCollection.findOneAndUpdate({ip: ip}, {$set: ipAddress});
            }
        })
    }

    /**
     * Ban IP address for server
     * @param {string} ip 
     * @returns 
     */
    static _serverIPban(ip) {
        if (ip == null) return false;
        serverCollection.findOne({ip: ip}).then(ipAddress => {
            if (ipAddress == null) return;
            ipAddress.ban = true;
            serverCollection.findOneAndUpdate({ip: ip}, {$set: ipAddress});
        })
    }

    /**
     * Unban IP address for server
     * @param {string} ip 
     * @returns 
     */
    static _serverIPunban(ip) {
        if (ip == null) return false;
        serverCollection.findOne({ip: ip}).then(ipAddress => {
            if (ipAddress == null) return;
            ipAddress.ban = false;
            serverCollection.findOneAndUpdate({ip: ip}, {$set: ipAddress});
        })
    }

    /**
     * Get IP address object
     * @param {string} ip 
     * @returns {{ip: string, count: number, ban: boolean, description: string}|false}
     */
    static async _serverIPGet(ip) {
        if (ip == null) return false;
        const ipAddress = await serverCollection.findOne({ip: ip});
        return ipAddress;
    }

    /**
     * Get banned IP addresses array
     * @returns
     */
    static async _serverIPGetBanned() {
        const bannedIP = await serverCollection.find({ban: true});
        return bannedIP;
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


    /**
     *  
     * @param {string} username 
     * @param {string} access_token 
     * @param {string} refresh_token 
     * @returns 
     */
    static _eveAdduser(username, access_token, refresh_token) {
        eveCollection.findOne({username: username}).then(user => {
            if (user != null) {
                eveCollection.findOneAndDelete({username: username});
                const docs = {
                    username: username,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    type: 'user',
                }
                eveCollection.insertOne(docs);
                return;
            }
            const docs = {
                username: username,
                accessToken: access_token,
                refreshToken: refresh_token,
                type: 'user',
            }
            eveCollection.insertOne(docs);
        })
        return true;
    }

    /**
     * Get all eve users
     * @returns 
     */
    static async _eveGetusers() {
        const users = await eveCollection.find({type: 'user'});
        return users;
    }
}

/* EXPORTS */
module.exports.DBmanager = DBmanager;

//'308924864407011328' => [User],
//'347031224121819136'