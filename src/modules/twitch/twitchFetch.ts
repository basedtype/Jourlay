/* IMPORTS */
import fetch from "node-fetch";
import { manager } from "../database/main";

/* CLASSES */
export class twitchFetch {
    private static options = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'qetz5m3hw8vv6qsid3uobvl8kjotfk',
        }
    }

    private static async getJson(url: string, options) {
        return await fetch(url, options).then(res => res.json()).catch(() => {});
    }

    public static async getUserID(username: string): Promise<null | string> {
        const url = `https://api.twitch.tv/kraken/users?login=${username}`;
        const response = await this.getJson(url, this.options);
        if (response == null || response.users == null || response.users[0] == null) return null;
        return response.users[0]._id;
    }

    public static async get(url: string, options?) {
        if (options == null) options = this.options;
        const id = await this.getUserID('jourloy');
        const bearer = await manager.getBearer(id);
        options.headers['Authorization'] = `Bearer ${bearer}`
        return await this.getJson(url, options);
    }

    public static async getCurrentViewers() {
        return await this.getJson('http://tmi.twitch.tv/group/user/jourloy/chatters', this.options);
    }
}