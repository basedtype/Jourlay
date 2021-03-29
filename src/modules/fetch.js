/**
 * 
 */

/* IMPORTS */
const fetch = require('node-fetch');

/* FUNCTIONS */
/**
 * Get json object from url
 * @param {string} url 
 * @param {{method: string, headers: {'Accept': string, 'Client-ID': string, 'Authorization': string?}?}} options 
 */
async function getJson(url, options) {
    return await fetch(url, options).then(res => res.json());
}

/* CLASSES */
class ftch {
    static options = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'q9hc1dfrl80y7eydzbehcp7spj6ga1'
        }
    }

    /**
     * Username to user id
     * @param {string} username 
     * @returns {string}
     */
    static async getUserID(username) {
        const url = `https://api.twitch.tv/kraken/users?login=${username}`;
        const response = await getJson(url, this.options);
        return response.users[0]._id;
    }

    /**
     * Get chatters on any channel
     * @param {string} username
     */
    static async getChatters(username) {
        const url = `https://tmi.twitch.tv/group/user/${username}/chatters`;
        return await getJson(url);
    }

    /**
     * Get json object from url
     * @param {string} url 
     * @param {{method: string, headers: {'Accept': string, 'Client-ID': string, 'Authorization': string?}}} options 
     */
    static async get(url, options) {
        if (options == null) options = this.options;
        return await getJson(url, this.options);
    }
}

/* EXPORTS */
module.exports.fetch = ftch;