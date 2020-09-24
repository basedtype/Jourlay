const fs = require("fs");

/**
 * Read file per line
 * @param {String} DBname
 * @return {String} not formatted chatter info
 */
function ReadLines(DBname) {
    const input = fs.readFileSync(DBname, "utf8");
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

    return chatterInfoNotFormatted;
}

/**
 * Create a database
 * @param {String} name
 * @return 0 = OK | -1 = Name is undefined | -2 = Error when program did try create file
 */
exports.CreateDB = (name) => {
    if (!name) return -1;
    try {
        fs.writeFileSync(`/home/samurai/Program/TwitchBot/src/Data/${name}.txt`, ' ');
        return 0;
    } catch (error) {
        console.log(error)
        return -2;
    }
}

/**
 * Check database
 * @param {String} name
 * @return 0 = OK | -1 = Name is undefined | -2 = File don't exist
 */
exports.CheckDB = (name) => {
    if (!name) return -1;
    try {
        if (fs.statSync(`/home/samurai/Program/TwitchBot/src/Data/${name}.txt`)) return 0;
        else return -2;
    } catch (error) {
        console.log(error)
        return -2;
    }
}

/**
 * Add information in database
 * Example of pattern: 'name second_name one_two_three'
 * Example of arrayPattern: 'username amountMessage warnings'
 * @param {String} name
 * @param {String} pattern
 * @param {Object} array
 * @param {String} arrayPattern
 * @return 0 = OK | -1 = Error when program did try add information in file
 */
exports.AddArrayInDB = (name, array, arrayPattern) => {
    const DBname = '/home/samurai/Program/TwitchBot/src/Data/' + name + '.txt';
    const DBarrayPattern = arrayPattern.split(' ')

    let information = [];
    for (i in array) {
        let arrayInformation = [];
        for (j in DBarrayPattern) arrayInformation.push(array[i][DBarrayPattern[j]]);
        arrayInformation = arrayInformation.join(' ');
        information.push(arrayInformation);
    }
    information = information.join('\n') + '\n'
    try {
        fs.writeFileSync(DBname, information);
        return 0;
    }
    catch (error) {
        console.log(error);
        return -1;
    }
}

/**
 * Return array with information from database
 * @param {String} name 
 * @param {String} pattern
 * @return {Object}
 */
exports.GetDataFromDB = (name, pattern) => {
    const DBname = '/home/samurai/Program/TwitchBot/src/Data/' + name + '.txt';
    const DBarrayPattern = pattern.split(' ');
    let chatterInfo;

    try { chatterInfo = ReadLines(DBname) }
    catch (err) {console.log(err); return -1}
   

    let information = {};

    for (i in chatterInfo) {
        const info = chatterInfo[i].split(' ');

        for (j in info) information[DBarrayPattern[j]] = info[j];
    }

    console.log(information)
    return information;
}

/**
 * this.createDB('test');
 * console.log(this.checkDB('test'));
 * this.addArrayInDB('test', 'name second_name', [{username: 'J', second_name: 'orul'}, {username: 'w', second_name: 'EWQ'}], 'username second_name')
 */
