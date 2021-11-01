import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const UsersBull = BullModule.registerQueueAsync({
    name: 'users',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        redis: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
        },
    }),
    inject: [ConfigService],
});