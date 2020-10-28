/**
 * Get info about rules
 * @param {String} lang 
 * @return {String}
 */
exports.rules = function(lang) {
    if (lang == 'ru') return `Правила в чате: Не спамить. Не говорить на тему политики. Не использовать запрещенные слова. Быть хорошим чатером :)`;
    if (lang == 'en') return `Chat rules: Don't spam. Don't talk about politics. Don't used banned words. Be good chatter :)`
}

/**
 * Get info about follow noftification
 * @param {String} lang 
 * @return {String}
 */
exports.follow = function(lang) {
    if (lang == 'ru') return `ты зарегистрировался в агенстве безопасти JOURLOY, спасибо, что выбрал нас`
    if (lang == 'en') return `you registered in security agency "JOURLOY", thank what you choose us`
}

/**
 * Get info when steam offline
 * @param {String} lang 
 * @return {String}
 */
exports.offline = function(lang) {
    if (lang == 'ru') return `стример сейчас оффлайн`;
    if (lang == 'en') return `streamer offline now`;
}

/**
 * Get info when stream online
 * @param {String} lang 
 * @return {String}
 */
exports.online = function(lang) {

}

/**
 * Get info about diskord
 * @param {String} lang 
 * @return {String}
 */
exports.diskord = function(lang) {
    if (lang == 'ru') return `Хочешь получать анонсы стримов? Тогда заходи на дискорд сервер https://discord.gg/DVukvAu`;
    if (lang == 'en') return `Want get stream news? So join on discord server https://discord.gg/DVukvAu`;
}

/**
 * Get info about all commands
 * @param {String} lang 
 * @return {String}
 */
exports.help = function(lang) {
    if (lang == 'ru') return `Все команды бота: !help`;
    if (lang == 'en') return `All bot's commands: !help`;
}

/**
 * Get info about games
 * @param {String} lang 
 * @return {String}
 */
exports.games = function(lang) {
    if (lang == 'ru') return `во все, что можно. Если есть идея, то можешь написать в чат :)`;
    if (lang == 'en') return `in all. If you want something, then type in chat :)`;
}

/**
 * Get info about games
 * @param {String} lang 
 * @return {String}
 */
exports.party = function(lang) {
    if (lang == 'ru') return `Все команды бота: !help`;
    if (lang == 'en') return `All bot's commands: !help`;
}

/**
 * TODO add English answers
 * Return information about bot
 * @param {String} lang 
 * @param {String} aim 
 * @returns {[String]}
 */
exports.whoAreYou = function(lang, aim) {
    if (aim == 'array') {
        if (lang == 'ru') return ['ты кто', 'ты хто', 'хто ты', 'кто ты', 'что ты', 'ты что', 'ты бот', 'ты человек'];
        if (lang == 'en') return [];
    }
    if (aim == 'answer') {
        if (lang == 'ru') return `что за вопросы, ты кто такой? А? Kappa`;
        if (lang == 'en') return ``;
    }
}