/**
 * Module for make your console more color
 * 
 * For examle:
 * colors('Just text', 'FgWhite', 'BgRed', 'Blink');
 */

/* CLASSES */
export class color {
    /**
     * 
     * @param text 
     * @param FgColor FgBlack` | `FgRed` | `FgGreen` | `FgYellow` | `FgBlue` | `FgMagenta` | `FgCyan` | `FgWhite` | ''
     * @param BgColor `BgBlack` | `BgRed` | `BgGreen` | `BgYellow` | `BgBlue` | `BgMagenta` | `BgCyan` | `BgWhite` | ''
     * @param option `Bright` | `Dim` | `Underscore` | `Blink` | `Reverse` | `Hidden` | ''
     * @returns 
     */
    public static get(text: string, FgColor?: string, BgColor?: string, option?: string): string {
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

    /**
     * Put text into symbol box
     * @param text Text in box
     * @param FgColor Border color => `FgBlack` | `FgRed` | `FgGreen` | `FgYellow` | `FgBlue` | `FgMagenta` | `FgCyan` | `FgWhite` | ''
     * @param BgColor Border color => `BgBlack` | `BgRed` | `BgGreen` | `BgYellow` | `BgBlue` | `BgMagenta` | `BgCyan` | `BgWhite` | ''
     * @param option Border color => `Bright` | `Dim` | `Underscore` | `Blink` | `Reverse` | `Hidden` | ''
     * @returns
     */
    static box(text: string, FgColor: string, BgColor: string, option: string): string {
        if (FgColor == null) FgColor = '';
        if (BgColor == null) BgColor = '';
        if (option == null) option = '';
        const split = text.split('\n');
        let result = this.get('╔', FgColor, BgColor, option);
        let maxLength = 0;
        for (let i in split) if (split[i].length > maxLength) maxLength = split[i].length;
        maxLength += 4;
        for (let i = 0; i < maxLength; i++) result += this.get('═', FgColor, BgColor, option);
        result += this.get('╗', FgColor, BgColor, option) + '\n';
        for (let i in split) {
            result += this.get('║', FgColor, BgColor, option) + '  ';
            if (split[i].length < maxLength - 6) {
                const left = Math.ceil((maxLength - 6) / 4);
                result += ' '.repeat(left);
                result += split[i];
                result += ' '.repeat(maxLength - 6 - left);
            } else result += split[i];
            result += '  ' + this.get('║', FgColor, BgColor, option) + '\n';
        }
        result += this.get('╚', FgColor, BgColor, option);
        for (let i = 0; i < maxLength; i++) result += this.get('═', FgColor, BgColor, option);
        result += this.get('╝', FgColor, BgColor, option);
        return result;
    }
}