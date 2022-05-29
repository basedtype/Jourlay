import axios from "axios";

export class Language {
	private static env = process.env;
	private static banTranslate = [`PogT`];

	/**
	 * It takes a string, splits it into an array of characters, and then iterates over each character,
	 * checking if it's in the English alphabet, and if it is, it replaces it with the corresponding
	 * character in the Russian alphabet.
	 * @param {string} message - The message to be converted.
	 * @returns a string that is the result of converting the message from English to Russian.
	 */
	public static convertWord(message: string) {
		const en =
			`qwertyuiop[]asdfghjkl;'zxcvbnm,.\`QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>~&?/`.split(
				``
			);
		const ru =
			`йцукенгшщзхъфывапролджэячсмитьбюёЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ?,.`.split(
				``
			);
		const m = message.split(``);
		let str = ``;
		for (const ms of m) {
			if (en.indexOf(ms) === -1) str += ms;
			else str += ru[en.indexOf(ms)];
		}
		return str;
	}

	/**
	 * It takes a word and checks if it has more than 3 consonants in a row.
	 * @param {string} word - The word to check
	 * @returns A boolean value.
	 */
	public static checkConsonants(word: string) {
		const w = word.split(``);
		const arr = `'\\/qwrtpsdfghjklzxcvbnm,`.split(``);
		let count = 0;
		let max = 0;
		for (const ww of w) {
			if (arr.includes(ww)) count++;
			else count = 0;
			if (max < count) max = count;
		}
		if (max > 3) return true;
		return false;
	}

	/**
	 * It checks if a message contains more than one English character.
	 * @param {string[]} message - The message to be checked.
	 * @returns A boolean value.
	 */
	public static checkEn(message: string[]) {
		const en =
			`qwertyuiop[]asdfghjkl;'zxcvbnm,.\`QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>~&`.split(
				``
			);
		for (const m of message) {
			const chars = m.split(``);
			let count = 0;
			for (const c of chars) if (en.includes(c)) count++;
			if (count > 1) return true;
		}
		return false;
	}

	/**
	 * It checks if all the elements in an array are the same.
	 * @param {string[]} message - The message to be checked.
	 * @returns a boolean value.
	 */
	public static checkDuplicate(message: string[]) {
		let count = -1;
		const mess = message[0];
		for (const m of message) if (m === mess) count++;
		if (count === message.length) return true;
		return false;
	}

	/**
	 * It checks if the word is in the Russian dictionary, if not, it checks if it's in the English dictionary, if
	 * not, it checks if it's a consonant, if not, it returns the word as is
	 * @param {string[]} message - string[] - an array of words from the message
	 * @returns a string.
	 */
	public static async checkWords(message: string[]) {
		let text = ``;
		let state = false;
		let amountOfConvert = 0;
		for (const ms of message) {
			const ruWord = this.convertWord(ms);

			const urlEn = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${this.env.YANDEX_DICT_KEY}&lang=en-ru&text=${ms}`;
			const urlRu = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${this.env.YANDEX_DICT_KEY}&lang=ru-ru&text=${ruWord}`;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const res: {def: any[]} = (await axios.get(new URL(urlRu).toString())).data;

			let convert = true;

			if (res.def.length > 0) state = true;
			else if (res.def.length === 0) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const resEn: {def: any[]} = (await axios.get(new URL(urlEn).toString()))
					.data;
				if (resEn.def.length > 0) convert = false;
				else if (state === false && !this.checkConsonants(ms)) convert = false;
			}

			if (convert && !this.banTranslate.includes(ms)) {
				text += this.convertWord(ms);
				amountOfConvert++;
			} else text += ms;
			if (message.indexOf(ms) !== message.length - 1) text += ` `;
		}
		return {text: text, count: amountOfConvert};
	}
}
