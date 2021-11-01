/* IMPORTS */
import configuration from '../configuration/configuration';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
	private readonly logger = new Logger(TaskService.name);

	@Cron(configuration().cron.taskLog)
	taskLog() {
		this.logger.log('10 seconds');
	}
}
