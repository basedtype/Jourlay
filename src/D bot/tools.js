/**
 * 
 * @param {Number} time in ms
 * @returns {Number} time in seconds, mitutes or hours
 */
exports.ConvertTime = function(time) {
    const seconds = time.seconds || null;
    const minutes = time.minutes || null;
    const hours = time.minutes || null;

    if (seconds != null) return seconds*1000;
    else if (minutes != null) return minutes*60*1000;
    else if (hours != null) return hours*60*60*1000;
    else return 15*60*1000
}

/**
 * Return random int between min and max
 * @param {Number} min minimal number
 * @param {Number} max maximal number
 * @returns {Number} random int between min and max
 */
exports.RandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * username, warnings, timeouts, bans, amountMessages, 0, amountPixels, 0, amountGifts
 * @param {*} chattersInfo 
 */
exports.SaveChattersInfo = function(chattersInfo) {
    let saveInformation = [];
    for (i in chattersInfo) {
        const information = `${chattersInfo[i].username} ${chattersInfo[i].mod.warnings} ${chattersInfo[i].mod.timeouts} ${chattersInfo[i].mod.bans} ${chattersInfo[i].amountMessages} 0 ${chattersInfo[i].amountPixels} 0 ${chattersInfo[i].amountGifts}`;
        saveInformation.push(information);
    }
    saveInformation = saveInformation.join('\n') + "\n";
    fs.writeFile("chatterInfo.txt", saveInformation, function(error){ if(error) throw error; });
}

function readLines() {
    const input = fs.readFileSync("chatterInfo.txt", "utf8");
    let chatterInfoNotFormatted = [];
    let chatterInfo = [];
    let line = '';
    
    for (let i = 0; i < input.length; i++) {
        if (input[i] != '\n') line += input[i];
        else {
            chatterInfoNotFormatted.push(line);
            line = '';
        }
    }

    for (i in chatterInfoNotFormatted) {
        let line = chatterInfoNotFormatted[i].split(' ');
        const userInfo = {
            username: line[0],
            mod: {
                warnings: parseInt(line[1]),
                timeouts: parseInt(line[2]),
                bans: parseInt(line[3]),
            },
            amountMessages: parseInt(line[4]),
            waitingTimerForPixels: 0,
            amountPixels: parseInt(line[6]),
            waitingTimerForGift: 0,
            amountGifts: parseInt(line[8]),
        }
        chatterInfo.push(userInfo);
    }
    return chatterInfo;
}

exports.GetChatterInfo = function() {
    return readLines();
}