
exports.bright = (text) => { return `\x1b[1m${text}\x1b[0m` }
exports.dim = (text) => { return `\x1b[2m${text}\x1b[0m` }
exports.underscore = (text) => { return `\x1b[4m${text}\x1b[0m` }
exports.blink = (text) => { return `\x1b[5m${text}\x1b[0m` }
exports.reverse = (text) => { return `\x1b[7m${text}\x1b[0m` }
exports.hidden = (text) => { return `\x1b[8m${text}\x1b[0m` }

exports.fgBlack = (text) => { return `\x1b[30m${text}\x1b[0m` }
exports.fgRed = (text) => { return `\x1b[31m${text}\x1b[0m` }
exports.fgGreen = (text) => { return `\x1b[32m${text}\x1b[0m` }
exports.fgYellow = (text) => { return `\x1b[33m${text}\x1b[0m` }
exports.fgBlue = (text) => { return `\x1b[34m${text}\x1b[0m` }
exports.fgMagenta = (text) => { return `\x1b[35m${text}\x1b[0m` }
exports.fgCyan = (text) => { return `\x1b[36m${text}\x1b[0m` }
exports.fgWhite = (text) => { return `\x1b[37m${text}\x1b[0m` }

exports.bgBlack = (text) => { return `\x1b[40m${text}\x1b[0m` }
exports.bgRed = (text) => { return `\x1b[41m${text}\x1b[0m` }
exports.bgGreen = (text) => { return `\x1b[42m${text}\x1b[0m` }
exports.bgYellow = (text) => { return `\x1b[43m${text}\x1b[0m` }
exports.bgBlue = (text) => { return `\x1b[44m${text}\x1b[0m` }
exports.bgMagenta = (text) => { return `\x1b[45m${text}\x1b[0m` }
exports.bgCyan = (text) => { return `\x1b[46m${text}\x1b[0m` }
exports.bgWhite = (text) => { return `\x1b[47m${text}\x1b[0m` }