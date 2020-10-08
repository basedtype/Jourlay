/**
 * Module for find banned word or symbols in text
 * @author Jourloy
 */

const bannedWords = [
    '',
    '',
]

/**
 * @return {[string]} array with banned words
 * @author Jourloy (github.com/Jourloy)
 */
exports.getBannedWords = () => { bannedWords };

/**
 * Check {message} on banned words and symbols
 * @param {String} message
 * @param {[string]} allowList
 * @return {Boolean}
 */
exports.checkString = function(message, allowList) {
    let check = false;

    if (check == false) {
        for (i in message) if (bannedWords.includes[message[i]]) check = true;
    }

    if (check == false) {
        for (i in message) {
            const buffer = Buffer.from(message[i]);
            const json = JSON.parse(JSON.stringify(buffer))
            if (json.data.length > 2 && !allowList.includes(message[i])) check = true;
        }
    }

    return check
}