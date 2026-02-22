import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/repositories/user.repository';
import { RegisterDto, LoginDto, AuthResponseDto } from './dtos/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * Auth Service
 * Handles authentication logic: login, register, token generation
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if username already exists
    const existingUser = await this.userRepository.findByUserName(
      registerDto.userName,
    );

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Create user
    const user = await this.userRepository.create({
      userName: registerDto.userName,
      password: hashedPassword,
    });

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.userName);

    return {
      accessToken,
      user: {
        id: user.id,
        userName: user.userName,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user with password
    const user = await this.userRepository.findByUserNameWithPassword(
      loginDto.userName,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.userName);

    return {
      accessToken,
      user: {
        id: user.id,
        userName: user.userName,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Validate user (used by JWT strategy)
   */
  async validateUser(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      userName: user.userName,
      isActive: user.isActive,
    };
  }

  // ─── Private Helper Methods ──────────────────────────────────────────────

  private generateToken(userId: string, userName: string): string {
    const payload: JwtPayload = {
      sub: userId,
      userName,
    };

    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
