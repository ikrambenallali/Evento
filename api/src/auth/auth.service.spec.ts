import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// ===== Mock du module bcrypt =====
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    _id: '1234567890abcdef',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user data if password matches', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'plainPassword');
      expect(result).toEqual({
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should return null if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      const result = await service.validateUser('unknown@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(mockUser.email, 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      const user = { id: mockUser._id, email: mockUser.email, role: mockUser.role };
      const result = await service.login(user);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });
  });

  describe('register', () => {
    it('should hash password, create user, and return access_token', async () => {
      const plainUser = { email: mockUser.email, password: 'plainPassword', role: mockUser.role };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.register(plainUser);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        email: mockUser.email,
        password: 'hashedPassword',
        role: mockUser.role,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: 'mocked-jwt-token',
        user: {
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });
  });
});
