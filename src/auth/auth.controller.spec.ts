import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ProgramInfoDto } from './dto/program-info.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    _signUp: jest.fn(),
    _login: jest.fn(),
    _programInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should successfully create a new user', async () => {
      const createUserDto: CreateUserDto = {
        organisation: 'IDCODE',
        nin: '12345678901234567890',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123!',
        phone: '+2348012345678',
        dob: '1990-01-01',
        gender: 'male',
        state: 'Lagos',
        lga: 'Ikeja',
        idcode: 'IDC001',
        terms: true,
      };

      const expectedResult = {
        message: 'User successfully created',
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        status: HttpStatus.CREATED,
      };

      mockAuthService._signUp.mockResolvedValue(expectedResult);

      const result = await controller.signup(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService._signUp).toHaveBeenCalledWith(createUserDto);
      expect(mockAuthService._signUp).toHaveBeenCalledTimes(1);
    });

    it('should throw conflict error when user already exists', async () => {
      const createUserDto: CreateUserDto = {
        organisation: 'IDCODE',
        nin: '12345678901234567890',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123!',
        phone: '+2348012345678',
        dob: '1990-01-01',
        gender: 'male',
        state: 'Lagos',
        lga: 'Ikeja',
        idcode: 'IDC001',
        terms: true,
      };

      mockAuthService._signUp.mockRejectedValue({
        message: 'User with Email Exists',
        statusCode: HttpStatus.CONFLICT,
      });

      await expect(controller.signup(createUserDto)).rejects.toEqual({
        message: 'User with Email Exists',
        statusCode: HttpStatus.CONFLICT,
      });
      expect(mockAuthService._signUp).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@example.com',
        password: 'SecurePassword123!',
      };

      const expectedResult = {
        message: 'User logged in successfully',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        status: HttpStatus.OK,
      };

      mockAuthService._login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService._login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService._login).toHaveBeenCalledTimes(1);
    });

    it('should throw not found error when user does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'SecurePassword123!',
      };

      mockAuthService._login.mockRejectedValue({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

      await expect(controller.login(loginDto)).rejects.toEqual({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw unauthorized error when password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@example.com',
        password: 'WrongPassword',
      };

      mockAuthService._login.mockRejectedValue({
        message: 'Invalid password',
        statusCode: HttpStatus.UNAUTHORIZED,
      });

      await expect(controller.login(loginDto)).rejects.toEqual({
        message: 'Invalid password',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    });
  });

  describe('programInfo', () => {
    it('should successfully submit program information', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const programInfoDto: ProgramInfoDto = {
        programme: 'Youth Development Program',
        expectations: 'Learn new skills and gain experience',
        knowledge: 'Basic computer skills and programming',
        organization: 'IDCODE Foundation',
        similar_participation: 'Yes, participated in tech bootcamp',
        previous_fmyd: 'No',
      };

      const expectedResult = {
        message: 'Program information saved successfully',
        status: HttpStatus.CREATED,
      };

      mockAuthService._programInfo.mockResolvedValue(expectedResult);

      const result = await controller.programInfo(uuid, programInfoDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService._programInfo).toHaveBeenCalledWith(
        uuid,
        programInfoDto,
      );
      expect(mockAuthService._programInfo).toHaveBeenCalledTimes(1);
    });

    it('should throw not found error when user does not exist', async () => {
      const uuid = 'nonexistent-uuid';
      const programInfoDto: ProgramInfoDto = {
        programme: 'Youth Development Program',
        expectations: 'Learn new skills',
        knowledge: 'Basic skills',
        organization: 'IDCODE',
        similar_participation: 'No',
        previous_fmyd: 'No',
      };

      mockAuthService._programInfo.mockRejectedValue({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

      await expect(
        controller.programInfo(uuid, programInfoDto),
      ).rejects.toEqual({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });
});