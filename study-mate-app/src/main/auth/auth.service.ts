import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../entities/User';
import { RegisterDto, LoginDto, ResetPasswordDto, VerifyEmailDto } from './dto/auth.dto';
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
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Create verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24); // 24 hours expiry

    // Create new user
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
      isVerified: false,
    });

    await this.usersRepository.save(user);

    // Send verification email
    await this.sendVerificationEmail(user.email, user.name, emailVerificationToken);

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.usersRepository.findOne({ where: { email: loginDto.email } });
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that the email doesn't exist
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await this.usersRepository.save(user);

    // Send reset email
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'reset-password',
      context: {
        name: user.name,
        resetUrl,
      },
    });
  }

  async resetPassword(token: string, newPassword: string) {
    // Find user by reset token
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.usersRepository.save(user);

    // Generate new tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
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

    return { verified: true };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that the email doesn't exist
      return;
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24); // 24 hours expiry

    // Update user with new token
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await this.usersRepository.save(user);

    // Send verification email
    await this.sendVerificationEmail(user.email, user.name, emailVerificationToken);
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    
    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  private async sendVerificationEmail(email: string, name: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    
    await this.mailService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name,
        verificationUrl,
      },
    });
  }

  private sanitizeUser(user: User) {
    const { password, passwordResetToken, passwordResetExpires, ...result } = user;
    return result;
  }
}
