const authService = require('../services/authService');

class AuthController {
  async signup(req, res, next) {
    try {
      const { name, password } = req.body;
      const email = req.body.email.toLowerCase().trim();
      const result = await authService.signup(email, name, password);
      res.status(200).json(result);
    } catch (err) {
      next(err); // Forward to global error handler
    }
  }

  async verifyOTP(req, res, next) {
    try {
      const { otp } = req.body;
      const email = req.body.email.toLowerCase().trim();
      const result = await authService.verifyOTP(email, otp);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { password } = req.body;
      const email = req.body.email.toLowerCase().trim();
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const email = req.body.email.toLowerCase().trim();
      const result = await authService.forgotPassword(email);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { otp, newPassword } = req.body;
      const email = req.body.email.toLowerCase().trim();
      const result = await authService.resetPassword(email, otp, newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
