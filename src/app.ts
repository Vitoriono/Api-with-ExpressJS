import express, { Express } from 'express';
import { Server } from 'http';
import { Container, inject, injectable } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IUserController } from './users/users.interface';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './configs/config.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';

@injectable()
export class App {
	server: Server;
	app: Express;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: IUserController,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is started on http://localhost:${this.port}`);
	}
}
