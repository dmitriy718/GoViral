import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${env.APP_URL}/verify-email?token=${token}`;
    
    try {
      await this.transporter.sendMail({
        from: `"PostDoctor" <${env.SMTP_USER}>`,
        to,
        subject: 'Verify your email address',
        html: `
          <h1>Welcome to PostDoctor!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      });
      logger.info({ to }, 'Verification email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send verification email');
      throw new Error('Failed to send verification email');
    }
  }
}

export const emailService = new EmailService();
