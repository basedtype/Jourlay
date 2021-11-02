import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageEmbed } from 'discord.js';
import * as fetch from "request-promise";

export let allGames = null;

@Injectable()
export class SteamService {
    private allGames = null;
    private options = {
        method: 'GET',
        headers: {}
    }

    private async getJson(url: string, options) {
        return JSON.parse(await fetch(url, options))
    }

    /**
     * Use only for init
     */
    @Cron('0 0 15 */1 * *')
    async _getAllGames() {
        const response = await this.getAllGames();
        if (response == null || response.applist == null || response.applist.apps == null) return;
        this.allGames = response.applist.apps;
    }

    private async getAllGames(): Promise<any> {
        const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/?';
        const response = await this.getJson(url, this.options);
        return response;
    }

    private async getAppDetails(appID: string): Promise<any> {
        const url = `https://store.steampowered.com/api/appdetails?appids=${appID}&cc=ru`;
        const response = await this.getJson(url, this.options);
        return response;
    }

    private async getFeatured(): Promise<any> {
        const url = 'https://store.steampowered.com/api/featuredcategories';
        const response = await this.getJson(url, this.options);
        return response;
    }

    getAppID(name: string): number | null {
        for (let i in allGames) if (allGames[i].name.toLowerCase() === name.toLowerCase()) return allGames[i].appid;
        return null;
    }
    
    async getSales(embed: MessageEmbed): Promise<MessageEmbed> {
        let currency = '';
        let data = null;
        while(currency !== 'RUB') {
            data = await this.getFeatured();
            console.log(data.specials.items[0].currency)
            currency = data.specials.items[0].currency
        }
        const sales = data.specials.items;
        for (let i in sales) {
            const product = sales[i];
            const oldPrice = (product.original_price * 0.01).toFixed(2);
            const price = (product.final_price * 0.01).toFixed(2);
            const percent = product.discount_percent;
            embed.addField(product.name, `**Скидка:** ${percent}%\n**Стоимость:** __${price}__\n**Старая цена:** ${oldPrice}\n[В магазин](https://store.steampowered.com/app/${product.id}/)\n`, true);
        }
        return embed;
    }
}
