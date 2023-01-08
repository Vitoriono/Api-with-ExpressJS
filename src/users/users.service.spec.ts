import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../configs/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './user.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.IUserService);
	usersRepository = container.get<IUsersRepository>(TYPES.IUsersRepository);
	userService = container.get<IUserService>(TYPES.IUserService);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		const createdUser = await userService.createUser({
			email: 'my.zipy@gmail.com',
			name: 'Rudolf',
			password: '23',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('23');
	});
});
