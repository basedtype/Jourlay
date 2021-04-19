/* IMPORTS */
//require('./modules/updateToken');
const { DBmanager } = require('../DBmanager');
const { tools } = require('../tools');
const fetch = require('node-fetch');
let client = null;

setInterval(() => {
    if (client == null) return;

    fetch(`https://esi.evetech.net/latest/characters/2114102005/wallet/`, client.options).then(res => {
        console.log(res)
    });
},10000)

function tradeStart() {
    const users = DBmanager._eveGetusers();
    users.then(usersToArray => {
        usersToArray.toArray((err, res) => {
            for (let i in res) {
                const user = res[i];
                if (user.username !== 'jourloy') return;
                const options = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${user.accessToken}`
                    }
                }
                client = {};
                client.options = options;
            }
        })
    })
}

setTimeout(() => {
    tradeStart();
}, 1000)