import { manager } from "../database/main"
import { discord } from "../discord/discord";
import { twitchFetch } from "./twitchFetch";

const opt = {
    method: "GET",
    headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        "Client-ID": "qetz5m3hw8vv6qsid3uobvl8kjotfk", // TODO: Remove
        'Authorization': 'OAuth g2fg29tk4zfikr5gh6qexxt2nsctda' // TODO: Remove
    }
}

/* setInterval(async () => {
    const users = await manager.scoutGetAll();

    for (let i in users) {
        const username = users[i].username;
        const id = await twitchFetch.getUserID(username);
        twitchFetch.get(`https://api.twitch.tv/kraken/streams/${id}`, opt)
            .then(data => {
                if (data != null && data.stream != null) {
                    if (username === 'h0wl1ng') {
                        discord.sendNoftificationInGuild('886908870860107787', username);
                    }
                    if (username === 'kartinka_katerinka') {
                        discord.sendNoftificationInGuild('886908870860107787', username);
                    }
                } else { ; };
            })
            .catch(() => { ; });
    }
}, 1000 * 60) */