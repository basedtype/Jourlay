const tools = require('../Tools/tools');
const graph = require('../Tools/graph');
const db = require('../Data/db');

/**
 * 
 * @param {Object} player {username, coins}
 */
exports.Hack = (username) => {
    const playerInfo =  db.GetDataFromDB('HackGameDB', 'username coins');
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
        const target = tools.GetRandomElementFromArray(playerInfo);
        info.target.username = target.username;
        info.target.coins = target.coins;

        const getCoins = tools.RandomInt(1, target.coins);
        const timer = tools.RandomInt(30, 120);

        info.timer = timer;
        info.getCoins = getCoins;
    } else {
        info.target.username = 'None';
        info.target.coins = 0;

        const getCoins = tools.RandomInt(1, 1000);
        const timer = tools.RandomInt(30, 120);

        info.timer = timer;
        info.getCoins = getCoins;
    }

    return info;
}