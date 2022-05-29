import {Module} from "@nestjs/common";
import {TwitchService} from "./twitch.service";

@Module({
	controllers: [],
	providers: [TwitchService],
})
export class TwitchModule {}
