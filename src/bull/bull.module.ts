import {BullModule} from "@nestjs/bull";
import {ConfigModule, ConfigService} from "@nestjs/config";

export const MainBull = BullModule.registerQueueAsync({
    name: 'main',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        redis: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
        },
    }),
    inject: [ConfigService],
});
