/* IMPORTS */
import { discord } from "../discord/discord";
import { manager } from "../database/main";
import { tools } from "../tools/main";
import { client } from "./main";
import * as upt from "./uptime";
import "./uptime";

import * as _ from "lodash";

/* PARAM */

/* FUNCTIONS */

/* INTERVALS */

/* REACTIONS */

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    const username = userstate['username'].toLowerCase();
    const messageSplit = message.split(' ');
    const msSplit = messageSplit[0].split('!');
    const command = msSplit[1];
})