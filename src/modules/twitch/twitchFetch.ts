/* IMPORTS */
import fetch from "node-fetch";

/* CLASSES */
export class twitchFetch {
    private static options = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'q9hc1dfrl80y7eydzbehcp7spj6ga1'
        }
    }

    private static async getJson(url: string, options) {
        return await fetch(url, options).then(res => res.json()).catch(() => {});
    }

    public static async getUserID(username: string) {
        const url = `https://api.twitch.tv/kraken/users?login=${username}`;
        const response = await this.getJson(url, this.options);
        return response.users[0]._id;
    }

    public static async get(url: string, options?) {
        if (options == null) options = this.options;
        return await this.getJson(url, options);
    }
}