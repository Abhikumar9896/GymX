const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user and send verification OTP
 */
router.post('/signup', (req, res, next) => authController.signup(req, res, next));

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and return auth token
 */
router.post('/verify-otp', (req, res, next) => authController.verifyOTP(req, res, next));

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send OTP for password recovery
 */
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));

/**
 * @route   POST /api/auth/reset-password
 * @desc    Set new password using OTP
 */
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));

module.exports = router;
