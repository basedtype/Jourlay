/* IMPORTS */
import fetch from "node-fetch";
import { tools } from "../tools/main";

export let allGames = null;

setInterval(async () => {
    const response = await steam.getAllGames();
    if (response == null || response.applist == null || response.applist.apps == null) return;
    allGames = response.applist.apps;
}, tools.convertTime({hours: 1}))

/* CLASSES */
export class steam {
    private static options = {
        method: 'GET',
        headers: {}
    }

    private static async getJson(url: string, options) {
        return await fetch(url, options).then(res => res.json()).catch(() => {});
    }

    public static async getAllGames() {
        const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/?';
        const response = await this.getJson(url, this.options);
        return response;
    }

    public static async getAppID(name: string) {
        for (let i in allGames) if (allGames[i].name.toLowerCase() === name.toLowerCase()) return allGames[i].appid;
        return null;
    }

    public static async getFeatured() {
        const url = 'https://store.steampowered.com/api/featuredcategories';
        const response = await this.getJson(url, this.options);
        return response;
    }

    public static async getAppDetails(appID: string) {
        const url = `https://store.steampowered.com/api/appdetails?appids=${appID}&cc=ru`;
        const response = await this.getJson(url, this.options);
        return response;
    }
}


steam.getAllGames().then(data => allGames = data.applist.apps);