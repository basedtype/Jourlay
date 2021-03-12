/* IMPORTS */
const request = require('request');

class watchtime {
    static run() {
        setInterval(function() {
            request('https://tmi.twitch.tv/group/user/jourloy/chatters', (error, response, body) => {
                const chatInfo = JSON.parse(body);
                const chatters = chatInfo.chatters;
                for (let i in chatters) {
                    for (let j in chatters[i]) {
                        const user = chatters[i][j];
                        
                    }
                }
            })
        }, 1000);
    }
}

module.exports.watchtime = watchtime;