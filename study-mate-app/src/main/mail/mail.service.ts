import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';
import { compile } from 'handlebars';

export interface SendMailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly templatesDir: string;
  private readonly appName: string;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.templatesDir = path.join(process.cwd(), 'src', 'mail', 'templates');
    this.appName = this.configService.get<string>('APP_NAME', 'StudyMate');
    this.from = this.configService.get<string>('SMTP_FROM', 'noreply@studymate.com');

    this.transporter = createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: this.configService.get<string>('NODE_ENV', 'development') === 'production',
      },
    });

    this.verifyConnection();
    this.registerHelpers();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified');
    } catch (error) {
      this.logger.error('Failed to verify SMTP connection', error);
      throw new Error('Failed to connect to SMTP server');
    }
  }

  private registerHelpers() {
    handlebars.registerHelper('eq', (a, b) => a === b);
    handlebars.registerHelper('neq', (a, b) => a !== b);
    handlebars.registerHelper('formatDate', (date: Date) => new Date(date).toLocaleDateString());
  }

  private async compileTemplate(templateName: string, context: Record<string, any>): Promise<string> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const template = compile(templateContent);
      return template({
        ...context,
        appName: this.appName,
        currentYear: new Date().getFullYear(),
      });
    } catch (error) {
      this.logger.error(`Failed to compile template ${templateName}:`, error);
      throw new Error(`Failed to compile email template: ${templateName}`);
    }
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, template, context } = options;

    try {
      const html = await this.compileTemplate(template, context);

      const mailOptions = {
        from: `"${this.appName}" <${this.from}>`,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} (${info.messageId})`);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    try {
      const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
      
      this.logger.log(`Sending verification email to ${email}`);
      const result = await this.sendMail({
        to: email,
        subject: 'Verify Your Email',
        template: 'verify-email',
        context: {
          name,
          verificationUrl,
          appName: this.appName,
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Verification email sent to ${email}`);
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      throw new Error(`Failed to send verification email: ${errorMessage}`);
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
    try {
      const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
      
      this.logger.log(`Sending password reset email to ${email}`);
      const result = await this.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: {
          name,
          resetUrl,
          appName: this.appName,
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Password reset email sent to ${email}`);
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw new Error(`Failed to send password reset email: ${errorMessage}`);
    }
  }
}
