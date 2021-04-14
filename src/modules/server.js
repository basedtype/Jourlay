/* IMPORTS */
const { DBmanager } = require('./DBmanager');
const { colors } = require('./colors');
const express = require('express')
const fs = require('fs');

/* PARAMS */
const app = express()
const hostname = '192.168.0.106';
const port = 80;
const banCount = 30;
const allowList = ['127.0.0.1', '192.168.0.106']

/* REACTIONS */
/**
 * Check IP address in database and and if need
 */
 app.use((request, response, next) => {
    const requestIP = request.ip.split(':').pop();
    DBmanager._serverIPGet().then(ipAddress => {
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
        if (ipAddress.count > banCount) {
            DBmanager._serverIPban(requestIP);
            console.log(colors.get(`[WARNING] IP address was banned {${requestIP}}`, 'FgYellow'));
            return;
        }
        next();
    })
})

/**
 * Response page
 */
app.use((request, response, next) => {
    try {
        let filePath = `./src/modules/site${request.url}`;
        const urlSplit = request.url.split('.');
        const file = urlSplit[urlSplit.length - 1];
        const header = `text/${file}`
        response.setHeader('Content-Type', header)
        response.statusCode = 200;
        response.end(fs.readFileSync(filePath));
    } catch {
        response.setHeader('Content-Type', 'text/plain')
        response.statusCode = 404;
        response.end('');
    }
    next();
})

/**
 * Start a server
 */
app.listen(port, hostname, (err) => {
    if (err) return console.log('something bad happened', err);
    console.log(`server is listening on ${port}`)
})