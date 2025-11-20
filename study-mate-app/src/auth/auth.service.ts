import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/User';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, academicLevel, institution } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create verification token
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24);

    // Create new user
    const user = this.usersRepository.create({
      email,
      password,
      name,
      academicLevel,
      institution,
      emailVerificationToken,
      emailVerificationExpires,
      isVerified: false,
    });

    await this.usersRepository.save(user);

    // Send verification email
    await this.mailService.sendVerificationEmail(
      user.email,
      user.name,
      emailVerificationToken,
    );

    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email);
    
    // Return user data without sensitive information
    const { password: _, ...userData } = user;
    return { user: userData, ...tokens };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email address');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email);
    
    // Return user data without sensitive information
    const { password: _, ...userData } = user;
    return { user: userData, ...tokens };
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepository.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: new Date(),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Mark email as verified
    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await this.usersRepository.save(user);
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (user) {
      // Generate reset token
      const resetToken = uuidv4();
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1);

      // Save reset token to user
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await this.usersRepository.save(user);

      // Send password reset email
      await this.mailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken,
      );
    }

    // Always return success to prevent email enumeration
    return { message: 'If an account exists with this email, a password reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: new Date(),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.usersRepository.save(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // In a real app, you might want to implement refresh token rotation
    // For now, we'll just issue a new access token
    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  private async getTokens(userId: string, email: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
