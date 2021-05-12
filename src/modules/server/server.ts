/* IMPORTS */
import { manager as database } from "../Database";
import { color } from "../tools/colors";

import * as subdomain from "express-subdomain";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as fs from "fs";

/* PARAMS */
const blockURLs = ['phpmyadmin', 'wp-login', 'manager', 'vendor', 'jenkins', 'samba', 'config', 'myadmin', '.git', 'config', 'users', '.php'];

/* FUNCTIONS */
/**
 * 
 * @param request 
 * @param response 
 * @returns 0 - Pass | 1 - Denied
 */
function checkURL(request: express.Request, response: express.Response): number {
    const IP = request.ip.split(":").pop();
    const url = request.url.split('/');

    for (let uri in url) {
        if (blockURLs.includes(uri) === true) {
            database.serverBanIP(IP);
            return 1;
        }
        const extensions = uri.split('.');
        for (let extension in extensions) {
            if (blockURLs.includes(extension) === true) {
                database.serverBanIP(IP);
                return 1;
            }
        }
    }
    return 0;
}

/**
 * Response requested page
 * @param request 
 * @param esponse 
 * @returns
 */
function getPage(request: express.Request, response: express.Response): boolean {
    let filePath = `./src/modules/www/${request.url}`.split('?')[0];
    const urlSplit = request.url.split('.');
    const file = urlSplit[urlSplit.length - 1];
    const header = `text/${file}`
    response.setHeader('Content-Type', header)
    response.statusCode = 200;
    response.end(fs.readFileSync(filePath));
    return true;
}

function host(app: express.Express): express.Express {
    /**
     * Defence server
     */
    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        const IP = request.ip.split(":").pop();
        const state = checkURL(request, response);
        if (state === 1) return 0;

        database.serverGetBannedIP().then(array => {
            array.forEach(address => {
                if (address.IP === IP) return;
            });
        })

        database.serverAddWarning(IP);

        next();
    })

    /**
     * COOKIE PARSER 
     */
    app.use(cookieParser('NqiqDq'));
    app.use(express.urlencoded({ extended: false }))

    /**
     * Add favicon
     */
    app.use('/favicon/favicon.ico', express.static('./src/modules/www/favicon/favicon.ico'));

    /**
     * Response css and js files
     */
    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        const urlSplit = request.url.split('.');
        const file = urlSplit[urlSplit.length - 1];
        if (file === 'css' || file === 'js') {
            let filePath = `./src/modules/www${request.url}`;
            const header = `text/${file}`;
            response.setHeader('Content-Type', header)
            response.statusCode = 200;
            response.end(fs.readFileSync(filePath));
            return 0;
        } else next();
    })

    /* MAIN RESPONSE */

    app.get('/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.redirect('/index.html');
    })

    app.get('/user/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.redirect('/user/index.html');
    })

    app.get('/index.html', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        getPage(request, response);
        return 0;
    })

    app.get('/user/giveaways.html', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        getPage(request, response);
        return 0;
    })

    app.get('/user/index.html', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        getPage(request, response);
        return 0;
    })

    /* API RESPONSE */

    app.get('/api/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.redirect('/api/index.html');
    })

    app.get('/api/index.html', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        getPage(request, response);
        return 0;
    })

    app.get('/api/giveaway/create', function (request, response, next) {
        const query = request.query;
        const give = {
            msgID: '',
            time: query.time,
            amount: query.amount,
            created: query.created,
            people: [],
            urlTitle: query.urlTitle,
            urlImage: query.urlImage,
            title: query.title,
            guildID: query.guildID,
            webUsername: query.webUsername,
        }
        discordTools.createGiveaway(give, response);
    })
   
    app.get('/api/config/user', function (request, response, next) {
        const query = request.query;
   
        if (query.type === 'check_access') {
            database._configGetUser(query.username).then(user => {
                if (user == null) response.json(`Access denied`);
                else if (user.giveaways == null) response.json(`Access denied`);
                else if (user.giveaways.includes(query.guildID) === false) response.json(`Access denied`);
                else response.json(`Success`);
                return;
            })
        }
    })

    return app;
}

export class server {
    static app = express();
    static api = express.Router();

    private static preStart(): number {
        this.app.use(subdomain('api', this.api));
        return 0;
    }

    public static testRun(): void {
        this.preStart();
        const HOST = '127.0.0.1'
        const PORT = 8000;

        this.app = host(this.app);

        this.app.listen(PORT, HOST, () => {
            console.log(`${color.get(`[server]`, `FgCyan`)} - start ${color.get('test', 'FgGreen')} on ${HOST}:${PORT}`);
        });
    }

    public static run(): void {
        this.preStart();
        const HOST = '192.168.0.103'
        const PORT = 80;

        this.app = host(this.app);

        this.app.listen(PORT, HOST, () => {
            console.log(`${color.get(`[server]`, `FgCyan`)} - start ${color.get('host', 'FgRed')} on ${HOST}:${PORT}`);
        });
    }
}



