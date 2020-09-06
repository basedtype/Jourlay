const fs = require("fs");

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
 * 
 * @returns {String} message
 */
exports.ChooseHelloMessages = function() {
    switch(RandomInt(0, 2)) {
        case 0: return `привет! Как дела?`;
        case 1: return 'хеллоу. Приятного просмотра';
        case 2: return `здрасте! Устраивайся поудобнее и приятного тебе просмотра`
    }
}

/**
 * Exit from program
 * @param {Number} status 
 */
exports.exit = function(status) {
    throw `Bot finished. Status: ${status}`;
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

/**
 * Read file per line
 */
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

/**
 * Return chatterInfo to main.js
 */
exports.GetChatterInfo = function() {
    return readLines();
}

/* 
 * Deprecated
exports.GeneratePixelStory = function() => {

    const rare = this.RandomInt(0, 10);
    let amountPixels = 0;
    
    switch (rare) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            amountPixels = this.RandomInt(10, 19);
            break;
        case 6:
            amountPixels = this.RandomInt(25, 35);
            break;
        case 7:
            amountPixels = this.RandomInt(35, 45);
            break;
        case 8:
            amountPixels = this.RandomInt(45, 55);
            break;
        case 9:
            amountPixels = this.RandomInt(55, 65);
            break;
        case 10:
            amountPixels = this.RandomInt(65, 75);
            break;
    }

    const descArray = ['обычный', 'красивый', 'редкий', 'уникальный', 'поломанный', 'большой', 'использованный', 'чужой', 'свой', 'красный', 'синий', 'известный'];
    const randomDesc = this.RandomInt(0, descArray.length);
    const desc = descArray[(descArray.length-1)%randomDesc];

    const thigsArray = ['телевизор', 'башмак', 'меч', 'щит', 'кирпич', 'посох', 'автомат', 'дробовик', 'пистолет', 'корабль', 'лазер', 'камень'];
    const randomThing = this.RandomInt(0, thigsArray.length);
    const thing = thigsArray[(thigsArray.length-1)%randomThing];

    const story = `${desc} ${thing}`;

    const pixelInfo = {
        Story: story,
        Amount: amountPixels
    };
    return pixelInfo;
} */

/**
 * Choose random answer
 */
exports.ChooseAnswer = function() {
    const array = ['да!','нет!','возможно','определенно нет','определенно да','50 на 50','шансы есть','без шансов','странный вопрос','я не хочу отвечать','может сменим тему?','не знаю'];
    return array[this.RandomInt(0, array.length-1)]
}