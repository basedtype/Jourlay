/* IMPORTS */
const { client } = require('./Bots/twitch');

/* PARAMS */
const uptime = null; 

/* INTERVALS */
setInterval(function() {
    client.api({
        url: `https://api.twitch.tv/kraken/streams/158466757`,
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1",
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly'
        }
    }, (err, res, body) => {
        if (body == null || body.stream == null) uptime = null;
        else if (body != null && body.stream != null) {
            let now = new Date();
            let then = body.stream.created_at;
            let ms = moment(now).diff(moment(then));
            let d = moment.duration(ms);
            uptime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        }
    })
}, 1000);

/* CLASSES */
class upt {
    static get() { return uptime }
}

/* EXPORTS */
module.exports.uptime = upt;