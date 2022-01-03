import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import { Time } from 'types';

@Injectable()
export class ToolsService {

	private readonly logger = new Logger(ToolsService.name);

	convertTime(time: Time): number {
		let totalTime = 0;
		if (time.seconds != null) totalTime += time.seconds * 1000;
		if (time.minutes != null) totalTime += time.minutes * 60 * 1000;
		if (time.hours != null) totalTime += time.hours * 60 * 60 * 1000;
		if (time.days != null) totalTime += time.days * 24 * 60 * 60 * 1000;
		if (time.weeks != null) totalTime += time.weeks * 7 * 24 * 60 * 60 * 1000;
		if (time.mounths != null) totalTime += time.mounths * 31 * 24 * 60 * 60 * 1000;
		return totalTime;
	}

	toHHMMSS(second: string) {
		const sec_num = parseInt(second, 10);
		const hours = Math.floor(sec_num / 3600);
		const minutes = Math.floor((sec_num - hours * 3600) / 60);
		const seconds = sec_num - hours * 3600 - minutes * 60;

		let formatedHours = '';
		let formatedMinutes = '';
		let formatedSeconds = '';

		if (hours < 10) formatedHours = '0' + hours;
		else formatedHours = hours.toString();
		if (minutes < 10) formatedMinutes = '0' + minutes;
		else formatedMinutes = minutes.toString();
		if (seconds < 10) formatedSeconds = '0' + seconds;
		else formatedSeconds = seconds.toString();

		return formatedHours + ':' + formatedMinutes + ':' + formatedSeconds;
	}

	toDDHHMMSS(second: string) {
		const sec_num = parseInt(second, 10);

		const days = Math.floor(sec_num / (3600 * 24));
		const hours = Math.floor((sec_num % (3600 * 24)) / 3600);
		const minutes = Math.floor((sec_num % 3600) / 60);
		const seconds = Math.floor(sec_num % 60);

		let formatedDays = '';
		let formatedHours = '';
		let formatedMinutes = '';
		let formatedSeconds = '';

		if (days < 10) formatedDays = `${days}`;
		else formatedDays = days.toString();
		if (hours < 10) formatedHours = `${hours}`;
		else formatedHours = hours.toString();
		if (minutes < 10) formatedMinutes = `${minutes}`;
		else formatedMinutes = minutes.toString();
		if (seconds < 10) formatedSeconds = `${seconds}`;
		else formatedSeconds = seconds.toString();

		return (
			formatedDays + ' дней ' + formatedHours + ':' + formatedMinutes + ':' + formatedSeconds
		);
	}

	random(min: number, max: number): number {
        max++;
		return Math.floor(Math.random() * (max - min) + min);
	}

	removeSpaces(str: string, char: string): string {
		return str.split(' ').join(char);
	}
}
