import { Injectable } from '@nestjs/common';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class AlisaService {

    constructor(
        private readonly discordService: DiscordService
    ) {}

    async testResp() {
        const obj = {
            "response": {
                "text": "Здравствуйте! Это мы, хороводоведы.",
                "tts": "Здравствуйте! Это мы, хоров+одо в+еды.",
                "end_session": false,
                "directives": {}
            },
            "session_state": {
                "value": 10
            },
            "user_state_update": {
                "value": 42
            },
            "application_state": {
                "value": 37
            },
            "analytics": {
                "events": [
                    {
                        "name": "custom event"
                    },
                    {
                        "name": "another custom event",
                        "value": {
                            "field": "some value",
                            "second field": {
                                "third field": "custom value"
                            }
                        }
                    }
                ]
            },
            "version": "1.0"
        }
        return obj;
    }

    private async buildResponse(answer: string, event: string, tts?: string, version?: string) {
        return {
            "response": {
                "text": answer,
                "tts": (tts == null)? answer : tts,
                "end_session": false,
                "directives": {}
            },
            "session_state": {
                "value": 10
            },
            "user_state_update": {
                "value": 42
            },
            "application_state": {
                "value": 37
            },
            "analytics": {
                "events": [
                    {
                        "name": event
                    },
                ]
            },
            "version": "1.0"
        }
    }

    async manager(command: string) {
        if (command === '' || command === 'команды') {
            const answer = `Вы можете попросить меня рассказать о моих командах, сказав "Алиса, команды". Также я могу создать канал в дискорде при помощи команды "Алиса, создай канал".`
            return this.buildResponse(answer, 'commands');
        } else if (command === 'создай канал') {
            this.discordService.createChannelByAlisa();
            return this.buildResponse('Отправила запрос', 'create_channel');
        }else {
            return this.buildResponse('Не совсем поняла вашу просьбу', 'not_find');
        }
    }
}
