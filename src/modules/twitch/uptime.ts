/* IMPORTS */
import { twitchFetch } from "./twitchFetch";
import { manager } from "../database/main";
import { client } from "./main";

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
            "Client-ID": "qetz5m3hw8vv6qsid3uobvl8kjotfk", // TODO: Remove
            'Authorization': 'OAuth g2fg29tk4zfikr5gh6qexxt2nsctda' // TODO: Remove
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
            } else { uptime = null };
        })
        .catch(() => { uptime = null });

    
    if (uptime == null) return;
    twitchFetch.getCurrentViewers().then(viewers => {
        if (viewers == null || viewers.chatters == null) {
            console.log(viewers);
            return;
        }
        const chatters = viewers.chatters;
        for (let i in chatters) {
            const group = chatters[i];
            for (let j in group) {
                if (group[j] === 'jourloy') continue;
                twitchFetch.getUserID(group[j]).then(id => manager.addWatchTime(id) )
            }
        }
    })
}, 1000)

setInterval(function () {
    if (authorID == null) twitchFetch.getUserID('jourloy').then(id => authorID = id);
}, 500);