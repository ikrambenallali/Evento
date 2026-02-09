import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue({
      id: '1234567890abcdef',
      email: 'test@example.com',
      role: 'user',
    }),
    login: jest.fn().mockResolvedValue({ access_token: 'mocked-jwt-token' }),
    register: jest.fn().mockResolvedValue({
      access_token: 'mocked-jwt-token',
      user: { id: '1234567890abcdef', email: 'test@example.com', role: 'user' },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login', async () => {
    const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
    const result = await controller.login(loginDto);

    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      loginDto.email,
      loginDto.password,
    );
    expect(mockAuthService.login).toHaveBeenCalledWith({
      id: '1234567890abcdef',
      email: 'test@example.com',
      role: 'user',
    });
    expect(result).toEqual({ access_token: 'mocked-jwt-token' });
  });

  it('should call register', async () => {
    const userData = { email: 'test@example.com', password: 'password', role: 'user' };
    const result = await controller.register(userData);

    expect(mockAuthService.register).toHaveBeenCalledWith(userData);
    expect(result).toEqual({
      access_token: 'mocked-jwt-token',
      user: { id: '1234567890abcdef', email: 'test@example.com', role: 'user' },
    });
  });
});
