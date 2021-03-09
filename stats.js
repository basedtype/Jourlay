const fs = require('fs');
const folder = './src/';

const count = {
    files: 0,
    lines: 0,
    comments: 0,
    space: 0,
}

class stats {
    static getLines(file) {
        const lines = fs.readFileSync(file).toString().split('\n');
        count.lines += lines.length;
        this.getComments(lines)
    }

    static getComments(lines) {
        let multiComment = false
        for (let i in lines) {
            if (lines[i].includes('//')) count.comments++;
            if (lines[i].includes('/*')) multiComment = true;
            if (lines[i].includes('*/')) multiComment = false;
            if (multiComment === true) count.comments++;
            if (lines[i].length === 0) count.space++;
        }
    }
    /**
     * Get lines of project
     */
    static getStats() {
        fs.readdirSync(folder).forEach(dirs => {
            if (dirs !== '.DS_Store') {
                if (dirs.includes('.js') === false) {
                    fs.readdirSync(folder+dirs).forEach(file => {
                        if (file.includes('.js') === false) {
                            fs.readdirSync(folder+dirs+'/'+file).forEach(fileNew => {
                                count.files++;
                                this.getLines(folder+dirs+'/'+file+'/'+fileNew);
                            });
                        } else {
                            count.files++;
                            this.getLines(folder+dirs+'/'+file);
                        }
                    })
                } else {
                    count.files++;
                    this.getLines(folder+dirs);
                }
            }
        })
        return count;
    }
}

module.exports.stats = stats;