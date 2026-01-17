import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const BRAND_COLOR = '#818cf8';
const BRAND_GRADIENT = 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)';

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PostDoctor</title>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { padding: 32px; text-align: center; background: #09090b; }
    .content { padding: 40px; }
    .footer { padding: 32px; text-align: center; font-size: 14px; color: #6b7280; }
    .button { display: inline-block; padding: 14px 32px; background: ${BRAND_COLOR}; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 24px; box-shadow: 0 10px 15px -3px rgba(129, 140, 248, 0.3); }
    h1 { margin: 0 0 16px; font-size: 24px; font-weight: 800; color: #111827; }
    p { margin: 0 0 16px; color: #4b5563; }
    .logo { font-size: 24px; font-weight: 900; color: #ffffff; text-decoration: none; letter-spacing: -0.5px; }
    .badge { display: inline-block; padding: 4px 12px; background: #eef2ff; color: ${BRAND_COLOR}; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <a href="${env.APP_URL}" class="logo">PostDoctor</a>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} PostDoctor. All rights reserved.</p>
        <p>You received this email because you signed up for PostDoctor.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = baseTemplate(`
      <div class="badge">Welcome Aboard</div>
      <h1>Hello, ${name}! ✨</h1>
      <p>We're thrilled to have you join PostDoctor. You're now one step closer to mastering viral marketing with AI.</p>
      <p>To get started, we need to verify your email address. We've sent a separate email with a verification link—please click it to unlock your Command Center.</p>
      <p>In the meantime, feel free to reply to this email if you have any questions. Our team is here to help you grow.</p>
      <p>See you inside!</p>
    `);

    try {
      await this.transporter.sendMail({
        from: `"PostDoctor" <${env.SMTP_USER}>`,
        to,
        subject: 'Welcome to PostDoctor! 🚀',
        html,
      });
      logger.info({ to }, 'Redesigned Welcome email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send welcome email');
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${env.APP_URL}/verify-email?token=${token}`;
    const html = baseTemplate(`
      <div class="badge">Security</div>
      <h1>Verify your email</h1>
      <p>Thanks for signing up! Please confirm that <strong>${to}</strong> is your email address by clicking the button below.</p>
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      <p style="margin-top: 24px; font-size: 13px; color: #9ca3af;">If the button doesn't work, copy and paste this link: <br> ${verificationUrl}</p>
      <p style="margin-top: 24px;">If you didn't create an account, you can safely ignore this email.</p>
    `);
    
    try {
      await this.transporter.sendMail({
        from: `"PostDoctor" <${env.SMTP_USER}>`,
        to,
        subject: 'Verify your email address 🔐',
        html,
      });
      logger.info({ to }, 'Redesigned Verification email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send verification email');
      throw new Error('Failed to send verification email');
    }
  }

  async sendAccessGrantedEmail(to: string, name: string) {
    const html = baseTemplate(`
      <div class="badge">Success</div>
      <h1>Verification Complete! 🔓</h1>
      <p>Hi ${name}, your email has been successfully verified.</p>
      <p>Your account is now fully active. You have complete access to the Content Studio, Growth Analytics, and the Platform Matrix.</p>
      <div style="text-align: center;">
        <a href="${env.APP_URL}" class="button">Go to Dashboard</a>
      </div>
      <p style="margin-top: 24px;">We can't wait to see what you create.</p>
      <p>Best,<br>The PostDoctor Team</p>
    `);

    try {
      await this.transporter.sendMail({
        from: `"PostDoctor" <${env.SMTP_USER}>`,
        to,
        subject: 'Your account is now active! 🚀',
        html,
      });
      logger.info({ to }, 'Redesigned Access Granted email sent');
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send access granted email');
    }
  }

  async sendContactAutoReply(to: string, name: string) {
    const html = baseTemplate(`
      <div class="badge">Support</div>
      <h1>We've received your message! 👋</h1>
      <p>Hi ${name},</p>
      <p>Thanks for reaching out to PostDoctor. This is just a quick note to let you know that we've received your inquiry and our team is already on it.</p>
      <p>We typically respond within 24 hours. If your matter is urgent, please feel free to check our <a href="${env.APP_URL}/learn">Knowledge Base</a> in the meantime.</p>
      <p>Talk soon,<br>The PostDoctor Team</p>
    `);

    try {
      await this.transporter.sendMail({
        from: `"PostDoctor Support" <${env.SMTP_USER}>`,
        to,
        subject: 'Re: We received your message 📩',
        html,
      });
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send contact auto-reply');
    }
  }

  async sendTicketCreatedEmail(to: string, name: string, ticketId: string, subject: string) {
    const html = baseTemplate(`
      <div class="badge">New Ticket</div>
      <h1>Ticket Created: #${ticketId}</h1>
      <p>Hi ${name},</p>
      <p>Your support ticket has been successfully opened. We're looking into your issue and will get back to you as soon as possible.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 24px 0;">
        <p style="margin: 0; font-weight: bold; color: #374151;">Subject:</p>
        <p style="margin: 4px 0 0; color: #4b5563;">${subject}</p>
      </div>
      <div style="text-align: center;">
        <a href="${env.APP_URL}/support" class="button">View Ticket Status</a>
      </div>
    `);

    try {
      await this.transporter.sendMail({
        from: `"PostDoctor Help Desk" <${env.SMTP_USER}>`,
        to,
        subject: `[Ticket #${ticketId}] ${subject}`,
        html,
      });
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send ticket created email');
    }
  }

  async sendTicketUpdatedEmail(to: string, name: string, ticketId: string, status: string) {
    const html = baseTemplate(`
      <div class="badge">Update</div>
      <h1>Ticket Update: #${ticketId}</h1>
      <p>Hi ${name},</p>
      <p>The status of your support ticket has been updated to: <strong>${status}</strong>.</p>
      <div style="text-align: center;">
        <a href="${env.APP_URL}/support" class="button">View Update</a>
      </div>
      <p style="margin-top: 24px;">If you have any further questions, simply reply to this email or update the ticket in your dashboard.</p>
    `);

    try {
      await this.transporter.sendMail({
        from: `"PostDoctor Help Desk" <${env.SMTP_USER}>`,
        to,
        subject: `Update on Ticket #${ticketId}`,
        html,
      });
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send ticket updated email');
    }
  }

  async sendTicketClosedEmail(to: string, name: string, ticketId: string) {
    const html = baseTemplate(`
      <div class="badge">Resolved</div>
      <h1>Ticket Closed: #${ticketId}</h1>
      <p>Hi ${name},</p>
      <p>We've marked your support ticket as **Resolved**. We hope we were able to help you effectively.</p>
      <p>If your issue persists or you have a new question, please don't hesitate to open a new ticket.</p>
      <p>How did we do? Feel free to reply and let us know.</p>
      <p>Best,<br>The PostDoctor Support Team</p>
    `);

    try {
      await this.transporter.sendMail({
        from: `"PostDoctor Help Desk" <${env.SMTP_USER}>`,
        to,
        subject: `Ticket #${ticketId} has been closed`,
        html,
      });
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send ticket closed email');
    }
  }
}

export const emailService = new EmailService();
