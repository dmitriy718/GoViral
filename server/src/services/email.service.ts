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

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: `"PostDoctor" <${env.SMTP_USER}>`,
        to,
        subject: 'Welcome to PostDoctor!',
        html: `
          <h1>Welcome, ${name}!</h1>
          <p>We're excited to have you on board.</p>
          <p><strong>Please check your inbox for a verification email.</strong> You will need to verify your email address before you can access all features of your account.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best,<br>The PostDoctor Team</p>
        `,
      });
      logger.info({ to }, 'Welcome email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send welcome email');
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${env.APP_URL}/verify-email?token=${token}`;
    
    try {
      await this.transporter.sendMail({
        from: `"PostDoctor" <${env.SMTP_USER}>`,
        to,
        subject: 'Verify your email address',
        html: `
          <h1>Verify your Email</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link is required to activate your account and access the dashboard.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      });
      logger.info({ to }, 'Verification email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send verification email');
      throw new Error('Failed to send verification email');
    }
  }

  async sendAccessGrantedEmail(to: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: `"PostDoctor" <${env.SMTP_USER}>`,
        to,
        subject: 'Your account is now active!',
        html: `
          <h1>Email Verified!</h1>
          <p>Hi ${name},</p>
          <p>Great news! Your email has been successfully verified.</p>
          <p>You now have full access to PostDoctor. You can start creating and scheduling your posts right away.</p>
          <p><a href="${env.APP_URL}">Go to Dashboard</a></p>
          <p>Best,<br>The PostDoctor Team</p>
        `,
      });
      logger.info({ to }, 'Access granted email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send access granted email');
    }
  }
}

export const emailService = new EmailService();