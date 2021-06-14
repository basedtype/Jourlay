/* IMPORTS */
import { client } from "./main";
import { twitchFetch } from "./twitchFetch";
import * as moment from "moment";

/* PARAMS */
let authorID = null
export let uptime = null;

/* INTERVALS */
setInterval(function () {
    if (authorID == null) return;
    const opt = {
        method: "GET",
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            "Client-ID": "q9hc1dfrl80y7eydzbehcp7spj6ga1", // TODO: Remove
            'Authorization': 'OAuth djzzkk9jr9ppnqucmx1ixsce7kl9ly' // TODO: Remove
        }
    }
    twitchFetch.get(`https://api.twitch.tv/kraken/streams/${authorID}`, opt)
        .then(data => {
            if (data != null && data.stream != null) {
                const now = new Date();
                const then = data.stream.created_at;
                const ms = moment(now).diff(moment(then));
                const d = moment.duration(ms);
                uptime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                uptime = uptime.split(':');
                for (let i in uptime) {
                    uptime[i] = parseInt(uptime[i]);
                }
            };
        })
        .catch(() => {});
}, 1000)

setInterval(function () {
    if (authorID == null) twitchFetch.getUserID('jourloy').then(id => authorID = id);
}, 500);