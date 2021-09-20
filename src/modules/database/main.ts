/* IMPORTS */
import { config } from "../../../types";
import { color } from "../tools/color";

import * as mongodb from "mongodb";
import * as _ from "lodash";

/* PARAMS */
const uri = "mongodb://192.168.0.3:10000/";
const clientDB = new mongodb.MongoClient(uri, { useUnifiedTopology: true });

let configCollection: mongodb.Collection = null;
let logCollection: mongodb.Collection = null;
let chattersCollection: mongodb.Collection = null;
let discordMembersCollection: mongodb.Collection = null;
let expeditionCollection: mongodb.Collection = null;
let defenceCollection: mongodb.Collection = null;
let musicCollection: mongodb.Collection = null;
let mainlogCollection: mongodb.Collection = null;
let botCollection: mongodb.Collection = null;
let twitchUserCollection: mongodb.Collection = null;
let twitchScoutCollection: mongodb.Collection = null;
let serverCollection: mongodb.Collection = null;
let serverIpCollection: mongodb.Collection = null;
let informationCollection: mongodb.Collection = null;
let redirectCollection: mongodb.Collection = null;
let nsfwCollection: mongodb.Collection = null;
let guildsCollection: mongodb.Collection = null;

/* CODE */
clientDB.connect().then(() => {
    const JRLYdatabase = clientDB.db('JOURLOY');
    configCollection = JRLYdatabase.collection('config');
    logCollection = JRLYdatabase.collection('logs');
    chattersCollection = JRLYdatabase.collection('chatters');
    discordMembersCollection = JRLYdatabase.collection('members');
    expeditionCollection = JRLYdatabase.collection('expedition');
    defenceCollection = JRLYdatabase.collection('defence');
    musicCollection = JRLYdatabase.collection('music');

    const botsDatabase = clientDB.db('Nidhoggbot');
    mainlogCollection = botsDatabase.collection('logs');
    botCollection = botsDatabase.collection('config')
    twitchUserCollection = botsDatabase.collection('twitch');
    twitchScoutCollection = botsDatabase.collection('scout');
    nsfwCollection = botsDatabase.collection('nsfw');
    guildsCollection = botsDatabase.collection('guilds');

    const serverDatabase = clientDB.db('Server');
    serverCollection = serverDatabase.collection('config');
    serverIpCollection = serverDatabase.collection('IP');
    informationCollection = serverDatabase.collection('info');
    redirectCollection = serverDatabase.collection('redirect');
})

export class manager {
    /* <=========================== CONFIG ===========================> */

    /**
     * Add bot in collection
     */
    public static configAddBot(username: string, type: string, oauth: string): boolean {
        if (botCollection == null) return;
        if (username == null) return;
        if (type == null) return;
        if (oauth == null) return;
        const docs: config.bot = {
            username: username,
            type: type,
            oauth: oauth
        }
        botCollection.insertOne(docs).then(() => {
            console.log(`${color.get(`[database]`, `FgCyan`)} - add bot in config file`);
            mainlogCollection.insertOne({ date: new Date(), text: '[database] - add bot in config file' });
        })
        return true;
    }

    /**
     * Get bot configs
     */
    public static async configGetBot(username: string, type: string): Promise<config.bot> {
        const bot = await botCollection.findOne({ username: username, type: type });
        return bot;
    }

    /* <=========================== JOURLOY ===========================> */

    /** 
     * Add log in pool
     */
    public static createLog(log: config.log) {
        logCollection.insertOne(log);
    }

    /**
     * Add watchtime
     */
    public static addWatchTime(id: string) {
        chattersCollection.findOne({ id: id }).then(chatter => {
            if (chatter == null) {
                const chatter = {
                    id: id,
                    watchTime: 1
                }
                chattersCollection.insertOne(chatter);
            } else {
                chatter.watchTime++;
                chattersCollection.findOneAndUpdate({ id: id }, { $set: chatter });
            }
        })
    }

    /**
     * Return information about chatter
     */
    public static getChatterInfo(id: string) {
        return chattersCollection.findOne({ id: id });
    }

    /**
     * Add log in log pool
     * @deprecated
     */
    public static jrlyAddLog(text: string): boolean {
        logCollection.insertOne({ text: text, date: new Date() })
        return true;
    }

    /**
     * Get log from log pool
     * @deprecated
     */
    public static async jrlyGetLog() {
        const log = await logCollection.findOne({});
        return log;
    }

    public static updateInviterMember(username: string) {
        discordMembersCollection.findOne({ username: username }).then(member => {
            if (member == null) {
                member = {
                    username: username,
                    inviteUses: 1
                }
                discordMembersCollection.insertOne(member);
            } else {
                member.inviteUses++;
                discordMembersCollection.findOneAndUpdate({ _id: member._id }, { $set: member });
            }
        })
    }

    public static async getInviterMembers() {
        const members = discordMembersCollection.find({}).toArray();
        return members;
    }

    public static expeditionUpdateMember(member) {

        return true;
    }

    public static async expeditionGetMember() {

    }

    public static expeditionUpdateFraction() {

        return true;
    }

    public static async expeditionGetFraction() {

    }

    public static async defenceGetWords(): Promise<string[]> {
        const words = await defenceCollection.findOne({ type: 'words' });
        if (words == null || words.array == null) return [];
        else return words.array;
    }

    public static async defenceGetBots(): Promise<string[]> {
        const words = await defenceCollection.findOne({ type: 'bots' });
        if (words == null || words.array == null) return [];
        else return words.array;
    }

    public static async defenceAddWord(word: string): Promise<boolean> {
        const words = await defenceCollection.findOne({ type: 'words' });
        if (words == null) {
            const docs = {
                array: [word],
                type: 'words'
            }
            const state = defenceCollection.insertOne(docs)
                .then(() => { return true })
                .catch((err) => { return false })
            return state;
        } else {
            words.array.push(word);
            const state = defenceCollection.findOneAndUpdate({ _id: words._id }, { $set: words })
                .then(() => { return true })
                .catch((err) => { return false });
            return state;
        }
    }

    /**
     * Add music in library
     * @false exist
     */
    public static async musicAdd(url: string, type: string): Promise<boolean> {
        const state = await musicCollection.findOne({ url: url }).then(async data => {
            if (data != null) return false;
            const docs = {
                url: url,
                type: type,
            }
            await musicCollection.insertOne(docs);
            return true;
        })
        return state;
    }

    /**
     * Get music from library
     */
    public static async musicGet(type: string, oldUrl: string): Promise<string> {
        const array = await musicCollection.find({ type: type }).toArray();
        const filteredArray = [];
        for (let i in array) if (array[i].url !== oldUrl) filteredArray.push(array[i].url);
        const url = _.sample(filteredArray);
        return url;
    }

    /**
     * Delete music from library
     * @false alredy deleted 
     * @true successfuly deleted
     */
    public static async musicDelete(url: string): Promise<boolean> {
        const state = await musicCollection.findOne({ url: url }).then(async data => {
            if (data == null) return false;
            await musicCollection.findOneAndDelete({ url: url });
            return true;
        })
        return state;
    }

    /**
     * Add user in scout
     */
    public static async scoutAdd(username: string): Promise<boolean> {
        const state = await twitchScoutCollection.findOne({ username: username }).then(async data => {
            if (data != null) return true;
            await twitchScoutCollection.insertOne({ username: username });
            return true;
        })
        return state;
    }

    /**
     * Get all users
     */
    public static async scoutGetAll(): Promise<any[]> {
        const array = await twitchScoutCollection.find({}).toArray();
        return array;
    }

    /**
     * Remove user from scout
     */
    public static async scoutRemove(username: string): Promise<boolean> {
        const state = await twitchScoutCollection.findOneAndDelete({ username: username });
        return true;
    }

    /**
     * Add NSFW photo in database
     */
    public static async nsfwAdd(url: string): Promise<boolean> {
        const state = await nsfwCollection.findOne({ url: url }).then(async data => {
            if (data != null) return false;
            await nsfwCollection.insertOne({ url: url });
            return true;
        })
        return state;
    }

    /**
     * Add guild
     */
    public static async guildAdd(id: string): Promise<boolean> {
        const state = await guildsCollection.insertOne({ id: id })
            .then(() => { return true })
            .catch(() => { return false })
        return state;
    }

    /**
     * Add sales channel
     */
    public static async guildSalesAdd(guildID: string, salesID: string): Promise<boolean> {
        const state = await guildsCollection.findOne({ id: guildID }).then(data => {
            if (data == null) {
                guildsCollection.insertOne({id: guildID, salesID: salesID, sendedSteam: false, sendedGOG: false, sendedEGS: false});
                return true;
            };
            data.salesID = salesID;
            data.sendedSteam = false;
            data.sendedGOG = false;
            data.sendedEGS = false;
            guildsCollection.findOneAndUpdate({ id: guildID }, { $set: data });
            return true;
        })
        return state;
    }

    /**
     * Switch sended info
     */
    public static async guildSalesSendedSteamSwitch(id: string): Promise<boolean> {
        const state = await guildsCollection.findOne({ id: id }).then(data => {
            if (data == null || data.sendedSteam == null) return false;
            if (data.sendedSteam === false) data.sendedSteam = true;
            else if (data.sendedSteam === true) data.sendedSteam = false;
            guildsCollection.findOneAndUpdate({ id: id }, { $set: data });
            return true;
        })
        return state;
    }

    /**
     * Switch sended info
     */
    public static async guildSalesSendedGOGSwitch(id: string): Promise<boolean> {
        const state = await guildsCollection.findOne({ id: id }).then(data => {
            if (data == null || data.sendedEGS == null) return false;
            if (data.sendedEGS === false) data.sendedEGS = true;
            else if (data.sendedEGS === true) data.sendedEGS = false;
            guildsCollection.findOneAndUpdate({ id: id }, { $set: data });
            return true;
        })
        return state;
    }

    /**
     * Switch sended info
     */
    public static async guildSalesSendedEGSSwitch(id: string): Promise<boolean> {
        const state = await guildsCollection.findOne({ id: id }).then(data => {
            if (data == null || data.sendedGOG == null) return false;
            if (data.sendedGOG === false) data.sendedGOG = true;
            else if (data.sendedGOG === true) data.sendedGOG = false;
            guildsCollection.findOneAndUpdate({ id: id }, { $set: data });
            return true;
        })
        return state;
    }

    /**
     * Get all guilds
     */
    public static async guildGetAll(): Promise<{ _id: string, id: string, salesID?: string, sended?: boolean }[]> {
        const state = await guildsCollection.find({}).toArray();
        return state;
    }

    /**
     * Remove guild
     */
    public static async guildRemove(id: string): Promise<boolean> {
        const state = await guildsCollection.findOneAndDelete({ id: id })
            .then(() => { return true })
            .catch(() => { return false })
        return state;
    }

    /* <=========================== SERVER ===========================> */

    /**
     * Add uptime
     */
    public static updateUptime(uptime: number, bot: string): boolean {
        informationCollection.findOne({ type: 'uptime', bot: bot }).then(upt => {
            if (upt == null) informationCollection.insertOne({ type: 'uptime', uptime: uptime, bot: bot });
            else informationCollection.findOneAndUpdate({ type: 'uptime', bot: bot }, { $set: { type: 'uptime', uptime: uptime, bot: bot } });
        })
        return true;
    }

    /**
     * Get uptime
     */
    public static async getUptime(bot: string): Promise<{ type: string, uptime: number, bot: string }> {
        const uptime = await informationCollection.findOne({ type: 'uptime', bot: bot });
        return uptime;
    }

    /**
     * Create redirect
     */
    public static async createRedirect(redirectURL: string, URL: string): Promise<boolean> {
        const state = await redirectCollection.findOne({ URL: URL })
            .then(redirect => {
                if (redirect != null) return false;
                const docs = { redirectURL: redirectURL, URL: URL };
                redirectCollection.insertOne(docs)
                    .then(() => { return true })
                    .catch((err) => { return false })
            })
            .catch((err) => { return false })
        return state;
    }

    /**
     * Remove redirect
     */
    public static async removeRedirect(opt: { redirectURL?: string, URL?: string }): Promise<boolean> {
        let state = false;
        if (opt.redirectURL != null) redirectCollection.findOne({ redirectURL: opt.redirectURL }).then(redirect => { if (redirect != null) redirectCollection.findOneAndDelete({ redirectURL: opt.redirectURL }) });
        else if (opt.URL != null) redirectCollection.findOne({ URL: opt.URL }).then(redirect => { if (redirect != null) redirectCollection.findOneAndDelete({ URL: opt.URL }) });
        return state;
    }

    /**
     * Get access token
     */
    public static async getBearer(id: string): Promise<string> {
        const bearer = await twitchUserCollection.findOne({ id: id }).then(user => {
            if (user == null) return '';
            return user.accessToken;
        })
        return bearer;
    }

    /**
     * Get refresh token
     */
    public static async getRefresh(id: string): Promise<string> {
        const refresh = await twitchUserCollection.findOne({ id: id }).then(user => {
            if (user == null) return '';
            return user.refreshToken;
        })
        return refresh;
    }

    /**
     * Update tokens
     */
    public static async updateTokens(id: string, refreshToken: string, accessToken: string): Promise<boolean> {
        twitchUserCollection.findOne({ id: id }).then(user => {
            if (user == null) return;
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            twitchUserCollection.findOneAndUpdate({ _id: user._id }, { $set: user });
        })
        return true;
    }
}