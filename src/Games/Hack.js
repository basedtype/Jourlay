const tools = require('../Tools/tools');
const graph = require('../Tools/graph');
const db = require('../Data/db');

/**
 * 
 * @param {Object} player {username, coins}
 */
exports.Hack = (username) => {
    const playerInfo =  db.GetDataFromDB('chatterDB', 'username coins');
    const hackPlayer = playerInfo.length;

    let info = {
        player: {
            username: username,
        },
        target: {
            username: '',
            coins: 0,
        },
        timer: 0,
        getCoins: 0,
    }

    if (tools.RandomInt(1, 100) <= hackPlayer) {
        let target;
        do {
            target = tools.GetRandomElementFromArray(playerInfo);
        } while (target.username.toLowerCase() != username.toLowerCase());
        info.target.username = target.username;
        info.target.coins = target.coins;

        const getCoins = tools.RandomFloat(0.00001, parseFloat(target.coins)+0.00001).toFixed(5);
        const timer = tools.RandomInt(30, 120);

        info.timer = timer;
        info.getCoins = getCoins;
    } else {
        info.target.username = 'None';
        info.target.coins = 0;

        const getCoins = tools.RandomFloat(0.00001, 0.001).toFixed(5);
        const timer = tools.RandomInt(30, 120);

        info.timer = timer;
        info.getCoins = getCoins;
    }

    return info;
}