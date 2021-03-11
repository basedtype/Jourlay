/* CLASS */ 
class db_manager {
    /**
     * 
     * @param {string} channel
     * @param {string} username 
     */
    static addBan(channel, username, collection) {
        collection.findOne({channel: channel}).then( data => {
            data.banUsers.push(username);
            collection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * 
     * @param {string} channel
     * @param {string} username 
     */
    static removeBan(channel, username, collection) {
        collection.findOne({channel: channel}).then( data => {
            const newArray = [];
            for (let i in data.banUsers) {
                if (data.banUsers[i] !== username) newArray.push(data.banUsers[i]);
            }
            data.banUsers = newArray;
            collection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * 
     * @param {string} channel
     * @param {string} username 
     */
     static addIgnore(channel, username, collection) {
        collection.findOne({channel: channel}).then( data => {
            data.ignoreUsers.push(username);
            collection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * 
     * @param {string} channel
     * @param {string} username 
     */
     static removeIgnore(channel, username, collection) {
        collection.findOne({channel: channel}).then( data => {
            const newArray = [];
            for (let i in data.ignoreUsers) {
                if (data.ignoreUsers[i] !== username) newArray.push(data.ignoreUsers[i]);
            }
            data.ignoreUsers = newArray;
            collection.findOneAndUpdate({channel: channel}, {$set: data});
        });
    }

    /**
     * 
     * @param {string} username 
     */
     static addWarning(username, warning, collection) {
        collection.findOne({username: username}).then( user => {
            user.warnings.push(warning);
            collection.findOneAndUpdate({username: username}, {$set: user});
        });
    }

    /**
     * 
     * @param {string} channel
     * @param {string} username 
     */
     static removeWarning(username, warning, collection) {
        collection.findOne({username: username}).then( user => {
            const newArray = []
            for (let i in user.warnings) {
                if (user.warnings[i] !== warning) newArray.push(user.warnings[i]);
            }
            user.warnings = newArray;
            collection.findOneAndUpdate({username: username}, {$set: user});
        });
    }
}

/* EXPORTS */
module.exports.db_manager = db_manager;