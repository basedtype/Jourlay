import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { Config } from 'types';

describe('ConfigurationService', () => {
	let service: ConfigurationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ConfigurationService],
		}).compile();

		service = module.get<ConfigurationService>(ConfigurationService);
	});

	it('should return HOST data', () => {
		const data = service.host;
		expect(data).toReturn();
	});
});
