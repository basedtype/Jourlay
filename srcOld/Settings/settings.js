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
    if (lang == 'ru') return `спасибо за фоллов, приятного просмотра!`
    if (lang == 'en') return `thank for follow!`
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
 * TODO
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
    if (aim == 'ask') {
        if (lang == 'ru') return ['ты кто', 'ты хто', 'хто ты', 'кто ты', 'что ты', 'ты что', 'ты бот', 'ты человек'];
        if (lang == 'en') return [];
    }
    if (aim == 'answer') {
        if (lang == 'ru') return `что за вопросы, ты кто такой? А? Kappa`;
        if (lang == 'en') return ``;
    }
}

/**
 * Return information about Kate
 * @param {String} lang 
 * @param {String} aim 
 * @return {[String]}
 */
exports.whereIsKate = function(lang, aim) {
    if (aim == 'ask') {
        if (lang == 'ru') return ['где', 'что делает', 'что катя делает'];
    }
    if (aim == 'answer') {
        if (lang == 'ru') return ['Катя сейчас  работает на 7ми работах', 'она строит дом', 'учит IP адресацию'];
    }
}

/**
 * Return when 
 * @param {String} lang 
 * @param {String} aim 
 * @return {[String]}
 */
exports.when = function(lang, aim) {
    if (aim == 'ask') {
        if (lang == 'ru') return ['когда'];
        if (lang == 'en') return ['when'];
    }
    if (aim == 'answer') {
        if (lang == 'ru') return ['завтра', 'когда рак на горе свистнет Kappa', 'через 7 минут', 'через 30 минут', 'послезавтра', 'в следующем году', 'в следующем месяца', 'тогда'];
        if (lang == 'en') return [];
    }
}

// TODO: Add changeSub func

/**
 * Return hi message
 * @param {String} lang 
 */
exports.hiMessage = function(lang) {
    if (lang == 'ru') return ['привет', 'хелоу', 'хай', 'куку', 'ку-ку', 'здрасте', 'здрасти', 'здравствуйте', 'здравствуй', 'приветули', 'bonjour', 'бонжур'];
    if (lang == 'en') return ['hi', 'hellp', 'sup', 'hey'];
}

/**
 * Return information when somebody send 'Set +' in chat
 * @param {String} lang
 */
exports.setPlus = function(lang) {
    if (lang == 'ru') return ['ставь +'];
    if (lang == 'en') return ['set +'];
}

/**
 * Return information when chat has been cleared
 * @param {String} lang
 */
exports.chatCleared = function(lang) {
    if (lang == 'ru') return `я первый Kappa`;
    if (lang == 'en') return `I'm first OMEGALUL`;
}

/**
 * Return information about balance
 * @param {String} lang
 */
exports.balance = function(lang) {
    if (lang == 'ru') return `, твой баланс: `;
    if (lang == 'en') return `, your balance: `;
}

/**
 * Return information about stream valute
 * @param {String} lang
 */
exports.valute = function(lang) {
    if (lang == 'ru') return `пиксль(ей)`;
    if (lang == 'en') return `pixel(s)`;
}

exports.minecraft = function(lang) {
    if (lang == 'ru') return `я хочу убить дракона на хардкоре`
}