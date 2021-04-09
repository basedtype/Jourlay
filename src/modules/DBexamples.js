/* EXAMPLES */

const _twitchChannel = {

}

const _globalUser = {
    channel: '',
    twitchID: '',
    discordID: '',
    twitch: {
        watchtime: 0,
        defence: {
            timers: {},
            deleteWords: [],
            timeoutWords: [],
            banWords: [],
        }
    },
    discord: {
        game: {
            raid: {},
            hero: {},
            village: {},
            fraction: {},
        },
        defence: {
            timers: {
                voiceChannels: 0,
            },
        },
    },
    defence: {
        warnings: [],
    }
}

const _configChannel = {
    
}

const _configBot = {
    username: '',
    type: '',
    oauth: '',
}

const _poolBlock = {
    type: '', // Twitch, Discord and etc
    owner: '',
    do: '', // What did bot 
}

/* EXPORTS */
exports.twitch = {
    channel: _twitchChannel,
}
exports.discord = {
}
exports.config = {
    channel: _configChannel,
    bot: _configBot,
}
exports.global = {
    user: _globalUser,
}
exports.pool = {
    block: _poolBlock,
}