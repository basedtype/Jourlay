const fs = require('fs');
const folder = './src/';

class stats {
    /**
     * Get lines of project
     */
    static getLines() {
        let lines = 0;
        fs.readdirSync(folder).forEach(dirs => {
            if (dirs !== '.DS_Store') {
                if (dirs.includes('.js') === false) {
                    fs.readdirSync(folder+dirs).forEach(file => {
                        if (file.includes('.js') === false) {
                            fs.readdirSync(folder+dirs+'/'+file).forEach(fileNew => {
                                lines += fs.readFileSync(folder+dirs+'/'+file+'/'+fileNew).toString().split('\n').length;
                            });
                        } else {
                            lines += fs.readFileSync(folder+dirs+'/'+file).toString().split('\n').length;
                        }
                    });
                }
            }
        });
        return lines;
    }
}

module.exports.stats = stats;