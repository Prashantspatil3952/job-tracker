const express = require("express");

const {
  registerUser,
  verifyEmail,
  resendVerificationOtp,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/verify-email",
  verifyEmail
);

router.post(
  "/resend-otp",
  resendVerificationOtp
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;