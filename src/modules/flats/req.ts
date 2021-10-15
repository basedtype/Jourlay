/* IMPORTS */
import fetch from "node-fetch";
import { manager } from "../database/main";

/* CLASSES */
export class req {
    private static async getJson(url: string, amount: number) {
        return await fetch(url).
            then(async res => {
                return await res.text().then(async (data: string) => {
                    const cards = [];
                    const splited = data.split("article");
                    let count = 0
                    let currentArticle = 1
                    for (let i in splited) {
                        if (parseInt(i) === 0) continue;
                        if (count === amount) return cards;
                        const spltd = splited[currentArticle]
                        const description = spltd.split('DescriptionComponent')[1].split('<p')[1].split('>')[1].slice(0, -3);
                        const price = spltd.split('MainPrice')[1].split('class="">')[1].split('<')[0];
                        const metro = spltd.split('remoteness')[1].split('>')[1].split('<')[0];
                        const info = spltd.split('TitleComponent')[1].split('class="">')[1].split('<')[0];

                        const pictures = [];
                        const pics = spltd.split('picture')
                        const picsAmount = Math.floor(pics.length / 3);
                        let currentPic = 2
                        for (let i = 0; i < picsAmount; i++) {
                            const pic = pics[currentPic].split('src="')[1].split('"')[0]
                            if (pic.includes('jpg') === true || pic.includes('png') === true) pictures.push(pic)
                            currentPic+=3;
                        }
                        const card = {
                            title: info,
                            price: price,
                            metro: metro,
                            description: description,
                            pictures: pictures
                        }
                        cards.push(card)
                        count++;
                        currentArticle += 2;
                    }
                })
            })
            .catch(() => { });
    }

    public static async get(amount: number) {
        const url = `https://spb.cian.ru/cat.php?currency=2&deal_type=rent&engine_version=2&maxprice=35000&offer_type=flat&p=1&region=2&room1=1&room2=1&type=4`;
        const response = await this.getJson(url, amount);
        if (response == null) return null;
        return response
    }
}