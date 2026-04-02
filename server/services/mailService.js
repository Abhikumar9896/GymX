const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'atspacebarr@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'pkhb clkw vgqf bznx'
      }
    });
  }

  async sendMail(options) {
    try {
      const mailOptions = {
        from: '"GymX Team" <atspacebarr@gmail.com>',
        ...options
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('[MailService] Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendVerificationOTP(email, otp) {
    const options = {
      to: email,
      subject: 'GymX Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #3B82F6; text-align: center;">Welcome to GymX!</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Your verification code to activate your GymX account is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <h1 style="background: #f8fafc; padding: 20px; display: inline-block; letter-spacing: 10px; color: #1E293B; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 36px; padding-left: 30px;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire soon. Please enter it in the app to continue.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2024 GymX Team. Stay fit, stay strong.</p>
        </div>
      `
    };
    return this.sendMail(options);
  }

  async sendPasswordRecoveryOTP(email, otp) {
    const options = {
      to: email,
      subject: 'GymX Password Recovery',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #EF4444; text-align: center;">Reset Your Password</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">We received a request to reset your GymX password. Your recovery code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <h1 style="background: #fef2f2; padding: 20px; display: inline-block; letter-spacing: 10px; color: #1E293B; border: 1px solid #fee2e2; border-radius: 8px; font-size: 36px; padding-left: 30px;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #64748b; text-align: center;">If you didn't request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2024 GymX Team. Secure your account.</p>
        </div>
      `
    };
    return this.sendMail(options);
  }
}

module.exports = new MailService();
