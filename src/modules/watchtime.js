/* IMPORTS */
const request = require('request');
const { db_manager } = require('./db_manager');
const { uptime } = require('./uptime');

class watchtime {
    static run() {
        setInterval(function() {
            request('https://tmi.twitch.tv/group/user/jourloy/chatters', (error, response, body) => {
                const chatInfo = JSON.parse(body);
                const chatters = chatInfo.chatters;
                for (let i in chatters) {
                    for (let j in chatters[i]) {
                        const username = chatters[i][j];
                        if (uptime.get() != null) db_manager.addWatchtime(username);
                    }
                }
            })
        }, 1000);
    }
}

module.exports.watchtime = watchtime;