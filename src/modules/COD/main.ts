/* IMPORTS */
const API = require('./fetch')();

/* PARAMS */
let client = null;

/* INTERVALS */
const updateInterval = setInterval(() => {
    if (client != null) {
        clearInterval(updateInterval);
        return;
    }
    API.login('shaposhnikov-igor@yandex.ru', `XpIyfoGSJk1`)
        .then(() => {client = API})
        .catch(() => {});
}, 1000)

/* CLASSES */
export class callOfDuty {
    public static async getPlayerInfo() {
        if (client == null) return;
        return await client.MWwz(`Onix#21703`, `battle`);
    }
}