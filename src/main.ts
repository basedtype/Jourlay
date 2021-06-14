/* IMPORTS */
import { color } from "./modules/tools/color";
import "./modules/discord/main";
import "./modules/twitch/main";

/* PARAMS */
const nvyLogo = `     ██╗ █████╗ ██╗   ██╗██████╗ ██╗      █████╗ ██╗   ██╗
     ██║██╔══██╗██║   ██║██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝
     ██║██║  ██║██║   ██║██████╔╝██║     ██║  ██║ ╚████╔╝ 
██╗  ██║██║  ██║██║   ██║██╔══██╗██║     ██║  ██║  ╚██╔╝  
╚█████╔╝╚█████╔╝╚██████╔╝██║  ██║███████╗╚█████╔╝   ██║   
 ╚════╝  ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚════╝    ╚═╝   `;

/* CODE */
console.log(color.box(nvyLogo, `FgRed`, '', ''));