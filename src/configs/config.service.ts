import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOptions, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject } from 'inversify/lib/annotation/inject';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] The file could not be read or is missing!');
		} else {
			this.logger.log('[ConfigService] Cofiguration .env loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
