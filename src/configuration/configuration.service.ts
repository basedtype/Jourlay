import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'types';

@Injectable()
export class ConfigurationService {
	constructor(private configService: ConfigService) {}
}
