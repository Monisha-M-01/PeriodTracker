import nodemailer from 'nodemailer';
import { env } from '../config/env';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
      console.log('📧 Email service initialized with SMTP transport.');
    } else {
      console.warn('⚠️ SMTP credentials not fully configured. Falling back to console logging for emails.');
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const subject = 'Reset Your Password - Period Tracker';
    const html = `
      <div style="font-family: sans-serif; max-w-md; margin: 0 auto; padding: 20px;">
        <h2 style="color: #C15F3C;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You recently requested to reset your password for your Period Tracker account. Click the button below to reset it.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #C15F3C; color: #ffffff; text-decoration: none; border-radius: 8px; margin-top: 10px; margin-bottom: 20px;">
          Reset Password
        </a>
        <p style="font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #666;">This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this URL into your browser:<br/>${resetUrl}</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"Period Tracker" <${env.SMTP_FROM}>`,
          to,
          subject,
          html,
        });
        console.log(`📧 Password reset email sent to ${to}`);
      } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
      }
    } else {
      // Development fallback
      console.log('=============================================');
      console.log(`📧 MOCK EMAIL TO: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`[RESET LINK]: ${resetUrl}`);
      console.log('=============================================');
    }
  }
}

export const emailService = new EmailService();
