import { Injectable } from '@nestjs/common';
import { getGames } from "epic-free-games";

@Injectable()
export class EgsService {
    async get(): Promise<{thisWeek: string, nextWeek: string, err?: boolean}> {
        return await getGames('RU')
            .then(async games => {
                const url = 'https://www.epicgames.com/store/ru/p/';
                let thisWeek = '';
                let nextWeek = '';

                for (let i in games.currents) if (games.currents[i].price.totalPrice.discountPrice === 0) thisWeek += `${games.currents[i].title} ([В магазин](${url}${games.currents[i].productSlug}))\n`;
                for (let i in games.nexts) nextWeek += `${games.nexts[i].title} ([В магазин](${url}${games.nexts[i].title.split(' ').join('-')}))\n`

                return {thisWeek: thisWeek, nextWeek: nextWeek};
            })
            .catch(err => { return {thisWeek: "", nextWeek: "", err: true} })
    }
}
