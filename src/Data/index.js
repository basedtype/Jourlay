const fs = require("fs");

/**
 * Create a database
 * @param {String} name 
 * @return 0 = OK | -1 = Name is undefined | -2 = Error when program did try create file
 */
exports.createDB = (name) => {
    if (!name) return -1;
    try {
        fs.writeFileSync(`${name}.txt`, ' ');
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
exports.checkDB = (name) => {
    if (!name) return -1;
    try {
        if (fs.statSync(`${name}.txt`)) return 0;
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
exports.addArrayInDB = (name, pattern, array, arrayPattern) => {
    const DBname = name + '.txt';
    const DBpattern = pattern.split(' ');
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
        console.log(error)
        return -1
    }
}

/**
 * this.createDB('test');
 * console.log(this.checkDB('test'));
 * this.addArrayInDB('test', 'name second_name', [{username: 'J', second_name: 'orul'}, {username: 'w', second_name: 'EWQ'}], 'username second_name')
 */