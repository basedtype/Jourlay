/**
 * 
 */

/* IMPORTS */
const { fetch } = require('../../fetch');
const { uptime } = require('./uptime');
const { DBmanager } = require('../../DBmanager');

/* INTERVALS */
setInterval(() => {
    const upt = uptime.get();
    if (upt.uptime === '') return;
    fetch.getChatters('jourloy').then(info => {
        const chatters = info.chatters;
        for (let i in chatters) {
            for (let j in chatters[i]) DBmanager.twitch.addWatchtime(chatters[i][j]);
        }
    })
}, 1000)