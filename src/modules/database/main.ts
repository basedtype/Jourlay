/* IMPORTS */
import { config } from "../../../types";
import { color } from "../tools/color";

import * as mongodb from "mongodb";

/* PARAMS */
const uri = "mongodb://192.168.0.3:10000/";
const clientDB = new mongodb.MongoClient(uri, { useUnifiedTopology: true });

let configCollection: mongodb.Collection = null;
let logCollection: mongodb.Collection = null;
let chattersCollection: mongodb.Collection = null;
let discordMembersCollection: mongodb.Collection = null;
let expeditionCollection: mongodb.Collection = null;
let defenceCollection: mongodb.Collection = null;
let mainlogCollection: mongodb.Collection = null;
let botCollection: mongodb.Collection = null;
let serverCollection: mongodb.Collection = null;
let serverIpCollection: mongodb.Collection = null;
let informationCollection: mongodb.Collection = null;
let redirectCollection: mongodb.Collection = null;
let twitchUserCollection: mongodb.Collection = null;

/* CODE */
clientDB.connect().then(() => {
    const JRLYdatabase = clientDB.db('JOURLOY');
    configCollection = JRLYdatabase.collection('config');
    logCollection = JRLYdatabase.collection('logs');
    chattersCollection = JRLYdatabase.collection('chatters');
    discordMembersCollection = JRLYdatabase.collection('members');
    expeditionCollection = JRLYdatabase.collection('expedition');
    defenceCollection = JRLYdatabase.collection('defence');

    const botsDatabase = clientDB.db('Nidhoggbot');
    mainlogCollection = botsDatabase.collection('logs');
    botCollection = botsDatabase.collection('config')
    twitchUserCollection = botsDatabase.collection('twitch');

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
     * Get bearer oauth
     */
    public static async getBearer(id: string): Promise<string> {
        const bearer = await twitchUserCollection.findOne({id: id}).then(user => {
            if (user == null) return '';
            return user.accessToken;
        })
        return bearer;
    }
}