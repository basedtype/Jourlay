/* EXAMPLES */

const _twitchUser = {
    username: '',
    id: '',
    watchtime: '',
    defence: {
        warnings: [],
        timers: {
            uptime: 0,
            information: 0,
        }
    },
    discordID: '',
}

const _twitchChannel = {
    username: '',
    id: '',
    defence: {
        timers: {},
        deleteWords: [],
        timeoutWords: [],
        banWords: [],
    }
}

const _discordUser = {
    username: '',
    id: '',
    game: {
        raid: {},
        hero: {},
        village: {},
        fraction: {},
    },
    defence: {
        warnings: [],
        timers: {
            voiceChannels: 0,
        },
    },
    twitchID: '',
}

const _globalUser = {
    defence: {
        warnings: [],
    },
    discordID: '',
    twitchID: '',
}

/* EXPORTS */
exports.twitch = {
    user: _twitchUser,
    channel: _twitchChannel,
}
exports.discord = {
    user: _discordUser,
}
exports.global = {
    user: _globalUser,
}