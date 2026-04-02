/**
 * API Configuration
 * 
 * When testing on physical devices:
 * 1. Ensure your backend server is running.
 * 2. If using ngrok, update the URL below to match your active ngrok tunnel.
 * 3. Make sure the phone has internet access.
 */

// If you have a static ngrok domain, put it here.
export const BASE_API_URL = 'https://pseudochemical-lourie-contractive.ngrok-free.dev/api';

export const API_ENDPOINTS = {
  AUTH: `${BASE_API_URL}/auth`,
  LOGIN: `${BASE_API_URL}/auth/login`,
  SIGNUP: `${BASE_API_URL}/auth/signup`,
  VERIFY_OTP: `${BASE_API_URL}/auth/verify-otp`,
  FORGOT_PASSWORD: `${BASE_API_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_API_URL}/auth/reset-password`,
};
