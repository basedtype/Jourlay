/* IMPORTS */
const { DBmanager } = require('./DBmanager');
const { colors } = require('./colors');
const express = require('express')
const fs = require('fs');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');

/* PARAMS */
const app = express()
const hostname = '127.0.0.1';
const port = 80;
const banCount = 30;
const allowList = ['127.0.0.1', '192.168.0.106', '77.66.178.141']

/* REACTIONS */
/**
 * Check IP address in database and add if need
 */
app.use((request, response, next) => {
    const requestIP = request.ip.split(':').pop();
    DBmanager._serverIPGet(requestIP).then(ipAddress => {
        if (ipAddress === null) DBmanager._serverIPAdd(requestIP);
        next();
    })
})

/**
 * Stop banned trafic
 */
app.use((request, response, next) => {
    const requestIP = request.ip.split(':').pop();
    DBmanager._serverIPGetBanned().then(ipAddress => {
        ipAddress.toArray((err, res) => {
            for (let i in res) if (res[i].ip === requestIP) {
                console.log(colors.get(`[WARNING] request from banned IP address was stopped`, 'FgYellow'));
                return;
            }
            next();
        })
    })
})

/**
 * Add warnings for IP address
 */
app.use((request, response, next) => {
    const requestIP = request.ip.split(':').pop();
    const requestURL = request.url;
    let filePath = `./src/modules/site${requestURL}`;
    try {
        fs.readFileSync(filePath);
    } catch {
        if (request.url !== '/' && allowList.includes(requestIP) === false) DBmanager._serverIPAdd(requestIP, 3);
        if (request.url === '/' && allowList.includes(requestIP) === false) DBmanager._serverIPAdd(requestIP, 1);
    }
    next();
})

/**
 * Ban IP address with limit warnings
 */
app.use((request, response, next) => {
    const requestIP = request.ip.split(':').pop();
    DBmanager._serverIPGet(requestIP).then(ipAddress => {
        if (ipAddress == null) {
            response.setHeader('Content-Type', 'text/plain')
            response.statusCode = 403;
            response.end('');
            return;
        }
        if (ipAddress.count > banCount) {
            DBmanager._serverIPban(requestIP);
            console.log(colors.get(`[WARNING] IP address was banned {${requestIP}}`, 'FgYellow'));
            return;
        }
        next();
    })
})

/**
 * Response css and etc files for server
 */
app.use((request, response, next) => {
    const requestIP = request.ip.split(':').pop();
    const urlSplit = request.url.split('.');
    const file = urlSplit[urlSplit.length - 1];
    if ((file === 'css' || file === 'js') && allowList.includes(requestIP) === true) {
        let filePath = `./src/modules/site${request.url}`;
        const header = `text/${file}`
        response.setHeader('Content-Type', header)
        response.statusCode = 200;
        response.end(fs.readFileSync(filePath));
    } else next();
})

/**
 * COOKIE PARSER 
 */
app.use(cookieParser('NqiqDq'));
app.use(express.urlencoded({ extended: false }))

/**
 * Nidhoggbot discord giveaway documentation
 */
app.get('/nidhoggbot/ru/giveaway.html', function (request, response, next) {
    //response.cookie('remember', 1, { maxAge: 60000 });
    //console.log(request.cookies)
    let filePath = `./src/modules/site${request.url}`;
    const urlSplit = request.url.split('.');
    const file = urlSplit[urlSplit.length - 1];
    const header = `text/${file}`
    response.setHeader('Content-Type', header)
    response.statusCode = 200;
    response.end(fs.readFileSync(filePath));
});

app.get('/eve/authErr.html', function (request, response, next) {
    //response.cookie('remember', 1, { maxAge: 60000 });
    //console.log(request.cookies)
    let filePath = `./src/modules/site${request.url}`;
    const urlSplit = request.url.split('.');
    const file = urlSplit[urlSplit.length - 1];
    const header = `text/${file}`
    response.setHeader('Content-Type', header)
    response.statusCode = 200;
    response.end(fs.readFileSync(filePath));
});

/**
 * Nidhoggbot eve auth success
 */
 app.get('/eve/auth.html', function (request, response, next) {
    let filePath = `./src/modules/site${request.url}`;
    const urlSplit = request.url.split('.');
    const file = urlSplit[urlSplit.length - 1];
    const header = `text/${file}`
    response.setHeader('Content-Type', header)
    response.statusCode = 200;
    response.end(fs.readFileSync(filePath));
});

/**
 * Nidhoggbot eve auth redirect
 */
app.get('/eve/auth', function (request, response, next) {
    if (request.query.username == null) response.redirect(`http://${hostname}/eve/authErr.html#queryUsernameUndefined`);
    else {
        let scopes = [
            'esi-characters.read_blueprints.v1',
            'esi-wallet.read_character_wallet.v1',
            'esi-wallet.read_corporation_wallets.v1',
            'esi-ui.write_waypoint.v1',
            'esi-ui.open_window.v1',
            'esi-mail.read_mail.v1',
            'esi-mail.organize_mail.v1',
            'esi-mail.send_mail.v1',
            'esi-markets.read_character_orders.v1',
            'esi-markets.read_corporation_orders.v1',
            'esi-markets.structure_markets.v1',
        ]
        scopes = scopes.join('%20')
        response.cookie('username', request.query.username, { maxAge: 60000 });
        response.redirect(`https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=http://${hostname}/eve/callback&client_id=67655ff739984b6cbab0782118bcbd2f&scope=${scopes}&state=NqiqDq`);
    }
});

/**
 * Nidhoggbot eve auth redirect
 */
app.get('/eve/callback', function (request, response, next) {
    if (request.query.code == null) response.redirect(`http://${hostname}/eve/authErr.html#authCodeUndefined`)
    else {
        const options = {
            method: "POST",
            headers: {
                "Authorization": "Basic Njc2NTVmZjczOTk4NGI2Y2JhYjA3ODIxMThiY2JkMmY6U3djc2J2SEtlR2lMNXRGUHNqVUo3dDZaYUplaW5DcGJZOEN3SThWYw==",
                "Content-Type": "application/x-www-form-urlencoded",
                "Host": "login.eveonline.com"
            },
            body: `grant_type=authorization_code&code=${request.query.code}`
        }
        
        //test(options)
        fetch(`https://login.eveonline.com/v2/oauth/token`, options).then(res => {
            res.json().then(data => {
                const username = request.cookies.username;
                const accessToken = data.access_token;
                const refreshToken = data.refresh_token;
                DBmanager._eveAdduser(username, accessToken, refreshToken);
                response.redirect(`http://${hostname}/eve/auth.html`)
            })
        });
    }
});

app.get('/api', function (request, response, next) {
    const query = request.query;
});

/**
 * Error handler for 404 error
 */
app.use((request, response, next) => {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html')
    response.end(fs.readFileSync('./src/modules/site/404.html'));
})

/**
 * Start a server
 */
app.listen(port, hostname, (err) => {
    if (err) return console.log('something bad happened', err);
    console.log(`server is listening on ${port}`)
})