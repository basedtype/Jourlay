/* IMPORTS */
import * as color from "../tools/colors";

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
            this.banIP(IP);
            return 1;
        }
        const extensions = uri.split('.');
        for (let extension in extensions) {
            if (blockURLs.includes(extension) === true) {
                this.banIP(IP);
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

function host(app: any) {
    /**
     * Defence server
     */
    app.use((request, response, next) => {
        const state = checkURL(request, response);
        if (state === 1) {

            // TODO: ADD IP IN DATABASE

            return 0;
        }

        // TODO: GET BANNED IP FROM DATABASE

        // TODO: ADD WARNING OBJECT FOR IP

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
    app.use((request, response, next) => {
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

    app.get('/index.html', (request, response, next) => {
        getPage(request, response);
        return 0;
    })

    return app;
}

export class server {
    static app = express();
    static api = express.Router();

    private static banIP(IP: string) {

    }

    private static preStart(): number {
        this.app.use(subdomain('api', this.api));
        return 0;
    }

    public static run(): void {
        this.preStart();
        const PORT = 8000;

        this.app = host(this.app);

        this.app.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
        });
    }
}



