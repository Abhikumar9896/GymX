const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'gymx_super_secret_key_123';

// NodeMailer Config for OTP Delivery
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL || 'atspacebarr@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'pkhb clkw vgqf bznx'
  }
});

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user and send verification OTP
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    console.log(`[AUTH] Signup Attempt: ${email}`);

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      }
      // If user exists but is not verified, we'll update them with a new OTP
      console.log(`[AUTH] Updating unverified user: ${email}`);
      user.name = name;
      user.password = password; // Will be hashed by pre-save hook
    } else {
      user = new User({ name, email, password });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    // Send OTP via Email
    const mailOptions = {
        from: '"GymX Team" <atspacebarr@gmail.com>',
        to: email,
        subject: 'GymX Verification Code',
        text: `Your GymX verification code is: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #3B82F6;">Welcome to GymX!</h2>
            <p>Your verification code is:</p>
            <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px; color: #1E293B;">${otp}</h1>
            <p>Enter this code in the app to activate your account.</p>
          </div>
        `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[AUTH] OTP sent to: ${email}`);
    
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('[AUTH ERROR] Signup:', err);
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and return auth token
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.body.email.toLowerCase().trim();

    console.log(`[AUTH] OTP Verification Attempt: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      console.log(`[AUTH] Invalid OTP for: ${email}`);
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    console.log(`[AUTH] User verified successfully: ${email}`);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('[AUTH ERROR] OTP Verify:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 */
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    console.log(`[AUTH] Login Attempt: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[AUTH] User not found: ${email}`);
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      console.log(`[AUTH] User unverified: ${email}`);
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[AUTH] Invalid password for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    console.log(`[AUTH] Login success: ${email}`);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('[AUTH ERROR] Login:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send OTP for password recovery
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    console.log(`[AUTH] Forgot Password Attempt: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your account first' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    const mailOptions = {
        from: '"GymX Support" <atspacebarr@gmail.com>',
        to: email,
        subject: 'GymX Password Recovery Code',
        text: `Your password recovery code is: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #EF4444;">Password Recovery</h2>
            <p>Your recovery code is:</p>
            <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px; color: #1E293B;">${otp}</h1>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Recovery OTP sent to: ${email}`);

    res.status(200).json({ message: 'Recovery code sent to email' });
  } catch (err) {
    console.error('[AUTH ERROR] Forgot Pass:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Set new password using OTP
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const email = req.body.email.toLowerCase().trim();

    console.log(`[AUTH] Password Reset Attempt: ${email}`);

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired recovery code' });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    user.otp = undefined;
    await user.save();

    console.log(`[AUTH] Password reset success: ${email}`);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('[AUTH ERROR] Reset Pass:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
