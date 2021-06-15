/* CLASSES */

import { config } from "../../../types";

export class logs {
    /**
     * 
     * @param text Text in body
     * @param toDiscord Send log in discord channel?
     * @param error This is error?
     */
    public static add(text: string, toDiscord?:boolean, error?: boolean) {
        if (toDiscord == null) toDiscord = false;
        let logText: string = null;
        if (error !== true) logText = `[LOG] -> ${text}`;
        else logText = `[ERROR] -> ${text}`
        const log: config.log = {
            text: logText,
            toDiscord: toDiscord,
        }
        if (error != null) {
            log.error = error;
        } else log.error = false;
    }
}