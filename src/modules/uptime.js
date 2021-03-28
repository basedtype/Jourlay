/**
 * 
 */

/* IMPORTS */
const { fetch } = require('../../fetch');

/* PARAMS */
const information = {
    uptime: '',
    gameHistory: '',
    viewers: 0,
    maxViewers: 0,
    gameWithMaxViewrs: '',
}

/* INTERVALS */
setInterval(() => {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }
    fetch.getUserID('jourloy').then(ID => {
        fetch.get(`https://api.twitch.tv/kraken/streams/${ID}`, options).then(body => {
            if (body == null || body.stream == null) information.uptime = '';
            else if (body != null && body.stream != null) {
                let now = new Date();
                let then = body.stream.created_at;
                let ms = moment(now).diff(moment(then));
                let d = moment.duration(ms);
                information.uptime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
            }
        })
    })
}, 1000)

/* CLASSES */
class uptime {
    static get() {
        return information;
    }

    static getFormatted() {
        if (information.uptime === '') return `Streamer now offline`;
        else return `Stream uptime is ${information.uptime}`
    }
}

/* EXPORTS */
module.exports.uptime = uptime;