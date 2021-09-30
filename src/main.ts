/* IMPORTS */
import { manager } from "./modules/database/main";
import { color } from "./modules/tools/color";
import "./modules/discord/main";
import "./modules/twitch/main";
//import "./modules/Binance/main";

/* PARAMS */
const nvyLogo = `     ██╗ █████╗ ██╗   ██╗██████╗ ██╗      █████╗ ██╗   ██╗
     ██║██╔══██╗██║   ██║██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝
     ██║██║  ██║██║   ██║██████╔╝██║     ██║  ██║ ╚████╔╝ 
██╗  ██║██║  ██║██║   ██║██╔══██╗██║     ██║  ██║  ╚██╔╝  
╚█████╔╝╚█████╔╝╚██████╔╝██║  ██║███████╗╚█████╔╝   ██║   
 ╚════╝  ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚════╝    ╚═╝   `;
const startTime = Date.now();

/* INTERVALS */
setInterval(() => {
     manager.updateUptime(Date.now() - startTime, 'jrly');
}, 1000)

/* CODE */
console.log(color.box(nvyLogo, `FgRed`, '', '') + '\n\n');