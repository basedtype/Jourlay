/* IMPORTS */
import fetch from "node-fetch";

/* CLASSES */
export class gog {
    private static options = {
        method: 'GET',
        headers: {}
    }

    private static async getJson(url: string, options) {
        return await fetch(url, options).then(res => res.json()).catch(() => {});
    }

    public static async getSales() {
        const url = 'https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&price=discounted&sort=popularity';
        const response = await this.getJson(url, this.options);
        const products = response.products;
        let count = 0
        let array = [];
        for (let i in products) {
            if (count > 11) continue;
            array.push(products[i]);
            count++
        }
        return array;
    }
}