import { Injectable } from '@nestjs/common';
import * as fetch from "request-promise";

@Injectable()
export class GogService {
    private options = {
        method: 'GET',
        headers: {}
    }

    private async getJson(url: string, options) {
        return JSON.parse(await fetch(url, options))
    }

    async getSales() {
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
