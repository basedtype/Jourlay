/* IMPORTS */
import fetch from "node-fetch";

/* CLASSES */
export class steam {
    private static options = {
        method: 'GET',
        headers: {}
    }

    private static async getJson(url: string, options) {
        return await fetch(url, options).then(res => res.json()).catch(() => {});
    }

    static async getFeatured() {
        const url = 'https://store.steampowered.com/api/featuredcategories';
        const response = await this.getJson(url, this.options);
        return response;
    }

    static async getAppDetails(appID: string) {
        const url = `https://store.steampowered.com/api/appdetails?appids=${appID}`;
        const response = await this.getJson(url, this.options);
        return response;
    }
}