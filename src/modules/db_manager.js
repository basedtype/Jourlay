/* IMPORTS */
const { MongoClient } = require("mongodb");

/* PARAMS */
let database = null;
let userCollection = null;
let channelCollection = null;

/* CODE */
clientDB.connect().then( err => {
    database = clientDB.db('Jourloy_bot');
    userCollection = database.collection('users');
    channelCollection = database.collection('channels');
})

/* CLASS */ 
class db_manager {
    /**
     * Add user to ban lists
     * @param {string} channel
     * @param {string} username 
     */
    static addBan(channel, username) {
        channelCollection.findOne({channel: channel}).then( data => {
            if (data.banUsers == null) data.banUsers = [];
            data.banUsers.push(username);
            channelCollection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * Remove user from ban list
     * @param {string} channel
     * @param {string} username 
     */
    static removeBan(channel, username) {
        channelCollection.findOne({channel: channel}).then( data => {
            if (data.banUsers == null) data.banUsers = [];
            const newArray = [];
            for (let i in data.banUsers) {
                if (data.banUsers[i] !== username) newArray.push(data.banUsers[i]);
            }
            data.banUsers = newArray;
            channelCollection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * Add user to ignore list
     * @param {string} channel
     * @param {string} username 
     */
     static addIgnore(channel, username) {
        channelCollection.findOne({channel: channel}).then( data => {
            if (data.ignoreUsers == null) data.ignoreUsers = [];
            data.ignoreUsers.push(username);
            channelCollection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * Remove user from ignore list
     * @param {string} channel
     * @param {string} username 
     */
     static removeIgnore(channel, username) {
        channelCollection.findOne({channel: channel}).then( data => {
            if (data.ignoreUsers == null) data.ignoreUsers = [];
            const newArray = [];
            for (let i in data.ignoreUsers) {
                if (data.ignoreUsers[i] !== username) newArray.push(data.ignoreUsers[i]);
            }
            data.ignoreUsers = newArray;
            channelCollection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * Add one warning
     * @param {string} username 
     */
     static addWarning(username, warning) {
        userCollection.findOne({username: username}).then( user => {
            if (user.warnings == null) user.warnings = []; 
            user.warnings.push(warning);
            userCollection.findOneAndUpdate({username: username}, {$set: user});
        });
    }

    /**
     * Remove one warning
     * @param {string} channel
     * @param {string} username 
     */
     static removeWarning(username, warning) {
        userCollection.findOne({username: username}).then(user => {
            if (user.warnings == null) user.warnings = [];
            const newArray = []
            for (let i in user.warnings) {
                if (user.warnings[i] !== warning) newArray.push(user.warnings[i]);
            }
            user.warnings = newArray;
            userCollection.findOneAndUpdate({username: username}, {$set: user});
        });
    }

    /**
     * Add second to user watchtime
     * @param {string} username 
     */
    static addWatchtime(username) {
        userCollection.findOne({username: username}).then(user => {
            if (user == null) {
                const docs = {
                    username: username,
                    whatchtime: 1,
                }
                userCollection.insertOne(docs);
            } else {
                if (user.whatchtime == null) user.whatchtime = 0;
                user.whatchtime++;
                userCollection.findOneAndUpdate({username: username}, {$set: user});
            }
        })
    }
}

/* EXPORTS */
module.exports.db_manager = db_manager;