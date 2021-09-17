/* IMPORTS */
import { manager } from "../database/main";

/* CLASSES */
export class defence {
    public static async check(text: string, id?: string): Promise<{bool: boolean, reason: string}> {
        const words = await manager.defenceGetWords();
        for (let i in words) if (text.includes(`${words[i]}`) === true) return {bool: false, reason: words[i]};
        return {bool: true, reason: ''};
    }

    public static async checkBots(text: string): Promise<{bool: boolean, reason: string}> {
        const words = await manager.defenceGetBots();
        for (let i in words) if (text.includes(`${words[i]}`) === true) return {bool: false, reason: words[i]};
        return {bool: true, reason: ''};
    }
}