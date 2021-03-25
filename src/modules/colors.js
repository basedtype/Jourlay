/**
 * Module for make your console more color
 * 
 * For examle:
 * colors('Just text', 'FgWhite', 'BgRed', 'Blink');
 */

/* CLASSES */
class colors {
    /**
     * 
     * @param {string} text 
     * @param {string} FgColor `FgBlack` | `FgRed` | `FgGreen` | `FgYellow` | `FgBlue` | `FgMagenta` | `FgCyan` | `FgWhite` | ''
     * @param {string} BgColor `BgBlack` | `BgRed` | `BgGreen` | `BgYellow` | `BgBlue` | `BgMagenta` | `BgCyan` | `BgWhite` | ''
     * @param {string} option `Bright` | `Dim` | `Underscore` | `Blink` | `Reverse` | `Hidden` | ''
     */
    static get(text, FgColor, BgColor, option) {
        if (FgColor == null) FgColor = '';
        if (BgColor == null) BgColor = '';
        if (option == null) option = '';

        const FgColors = {
            'FgBlack': "\x1b[30m",
            'FgRed': "\x1b[31m",
            'FgGreen': "\x1b[32m",
            'FgYellow': "\x1b[33m",
            'FgBlue': "\x1b[34m",
            'FgMagenta': "\x1b[35m",
            'FgCyan': "\x1b[36m",
            'FgWhite': "\x1b[37m",
            '': ''
        }

        const BgColors = {
            'BgBlack': "\x1b[40m",
            'BgRed': "\x1b[41m",
            'BgGreen': "\x1b[42m",
            'BgYellow': "\x1b[43m",
            'BgBlue': "\x1b[44m",
            'BgMagenta': "\x1b[45m",
            'BgCyan': "\x1b[46m",
            'BgWhite': "\x1b[47m",
            '': ''
        }

        const optColors = {
            Reset: "\x1b[0m",
            'Bright': "\x1b[1m",
            'Dim': "\x1b[2m",
            'Underscore': "\x1b[4m",
            'Blink': "\x1b[5m",
            'Reverse': "\x1b[7m",
            'Hidden': "\x1b[8m",
            '': ''
        }

        return FgColors[FgColor] + BgColors[BgColor] + optColors[option] + text + optColors.Reset;
    }
}

module.exports.colors = colors;