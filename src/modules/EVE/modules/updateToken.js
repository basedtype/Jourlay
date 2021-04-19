/* IMPORTS */
const { DBmanager } = require('../../DBmanager');
const { tools } = require('../../tools');
const fetch = require('node-fetch');

/* INTERVALS */
setInterval(() => {
    const users = DBmanager._eveGetusers();
    users.then(usersToArray => {
        usersToArray.toArray((err, res) => {
            for (let i in res) {
                const user = res[i];
                const options = {
                    method: "POST",
                    headers: {
                        "Authorization": "Basic Njc2NTVmZjczOTk4NGI2Y2JhYjA3ODIxMThiY2JkMmY6U3djc2J2SEtlR2lMNXRGUHNqVUo3dDZaYUplaW5DcGJZOEN3SThWYw==",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Host": "login.eveonline.com"
                    },
                    body: `grant_type=refresh_token&refresh_token=${user.refreshToken}`
                }
                fetch(`https://login.eveonline.com/v2/oauth/token`, options).then(res => {
                    res.json().then(data => {
                        const username = user.username;
                        const accessToken = data.access_token;
                        const refreshToken = data.refresh_token;
                        DBmanager._eveAdduser(username, accessToken, refreshToken);
                    })
                });
            }
        })
    })
}, tools.convertTime({ minutes: 15 }));