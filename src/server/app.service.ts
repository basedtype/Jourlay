import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(text: string): string {
		return 'Hello World!\nThis is ' + text;
	}
}
