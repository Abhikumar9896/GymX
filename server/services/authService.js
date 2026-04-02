const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mailService = require('./mailService');
const { validateSignup } = require('../utils/validation');

class AuthService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'gymx_super_secret_key_123';
  }

  async signup(email, name, password) {
    // Validation
    const errors = validateSignup({ email, name, password });
    if (errors.length > 0) {
      const err = new Error(errors[0]);
      err.status = 400;
      throw err;
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      throw new Error('User already exists and is verified');
    }

    if (user) {
      user.name = name;
      user.password = password; // Hashed by User model pre-save hook
    } else {
      user = new User({ email, name, password });
    }

    const otp = this._generateOTP();
    user.otp = otp;
    await user.save();

    await mailService.sendVerificationOTP(email, otp);
    return { message: 'OTP sent to email' };
  }

  async verifyOTP(email, otp) {
    const user = await User.findOne({ email });

    if (!user) throw new Error('User not found');
    if (user.otp !== otp) throw new Error('Invalid verification code');

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = this._generateToken(user._id);
    return { token, user: { id: user._id, name: user.name, email: user.email } };
  }

  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) throw new Error('User not found');
    if (!user.isVerified) throw new Error('Please verify your email first');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = this._generateToken(user._id);
    return { token, user: { id: user._id, name: user.name, email: user.email } };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) throw new Error('User not found');
    if (!user.isVerified) throw new Error('Please verify your account first');

    const otp = this._generateOTP();
    user.otp = otp;
    await user.save();

    await mailService.sendPasswordRecoveryOTP(email, otp);
    return { message: 'Recovery code sent to email' };
  }

  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      throw new Error('Invalid or expired recovery code');
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }

  _generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  _generateToken(userId) {
    return jwt.sign({ id: userId }, this.JWT_SECRET, { expiresIn: '30d' });
  }
}

module.exports = new AuthService();
