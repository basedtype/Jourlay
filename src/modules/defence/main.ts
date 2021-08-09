/* IMPORTS */
import { manager } from "../database/main";

/* CLASSES */
export class defence {
    public static async check(text: string, id: string): Promise<{bool: boolean, reason: string}> {
        const chatter = await manager.getChatterInfo(id);
        const words = await manager.defenceGetWords();

        for (let i in words) {
            if (text.includes(words[i]) === true) {
                if (chatter == null || chatter.watchTime == null || chatter.watchTime < 50) return {bool: false, reason: words[i]};
            }
        }
        return {bool: true, reason: ''};
    }
}