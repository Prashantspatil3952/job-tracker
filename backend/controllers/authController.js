const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");

function generateOtp() {
  return String(
    crypto.randomInt(100000, 1000000)
  );
}

function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

// ===============================
// REGISTER
// ===============================

async function registerUser(req, res) {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const cleanName = name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (
      existingUser &&
      existingUser.isVerified
    ) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    let user;

    if (existingUser) {
      existingUser.name = cleanName;

      existingUser.password =
        hashedPassword;

      existingUser.isVerified = false;

      existingUser.verificationOtpHash =
        otpHash;

      existingUser.verificationOtpExpiresAt =
        otpExpiresAt;

      user = await existingUser.save();
    } else {
      user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        isVerified: false,

        verificationOtpHash:
          otpHash,

        verificationOtpExpiresAt:
          otpExpiresAt,
      });
    }

    try {
      await sendVerificationEmail({
        toEmail: user.email,
        toName: user.name,
        otp,
      });
    } catch (emailError) {
      console.error(
        "Verification email error:",
        emailError
      );

      return res.status(502).json({
        message:
          "Account created, but verification email could not be sent. Please try again.",
      });
    }

    return res.status(201).json({
      message:
        "Registration successful. Verification OTP sent to your email.",

      email: user.email,
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during registration",
    });
  }
}

// ===============================
// VERIFY EMAIL
// ===============================

async function verifyEmail(req, res) {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message:
          "Email and OTP are required",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanOtp =
      String(otp).trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message:
          "Email is already verified",
      });
    }

    if (
      !user.verificationOtpHash ||
      !user.verificationOtpExpiresAt
    ) {
      return res.status(400).json({
        message:
          "No verification OTP is available. Please request a new OTP.",
      });
    }

    if (
      user.verificationOtpExpiresAt.getTime() <
      Date.now()
    ) {
      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    const incomingOtpHash =
      hashOtp(cleanOtp);

    if (
      incomingOtpHash !==
      user.verificationOtpHash
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;

    user.verificationOtpHash =
      null;

    user.verificationOtpExpiresAt =
      null;

    await user.save();

    return res.status(200).json({
      message:
        "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error(
      "Verify email error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during email verification",
    });
  }
}

// ===============================
// RESEND VERIFICATION OTP
// ===============================

async function resendVerificationOtp(
  req,
  res
) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message:
          "Email is already verified",
      });
    }

    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    user.verificationOtpHash =
      otpHash;

    user.verificationOtpExpiresAt =
      new Date(
        Date.now() + 10 * 60 * 1000
      );

    await user.save();

    await sendVerificationEmail({
      toEmail: user.email,
      toName: user.name,
      otp,
    });

    return res.status(200).json({
      message:
        "A new OTP has been sent",
    });
  } catch (error) {
    console.error(
      "Resend OTP error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while resending OTP",
    });
  }
}

// ===============================
// LOGIN
// ===============================

async function loginUser(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not configured"
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during login",
    });
  }
}

// ===============================
// FORGOT PASSWORD - SEND OTP
// ===============================

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    // Only previously created AND verified accounts
    if (!user || !user.isVerified) {
      return res.status(404).json({
        message:
          "No verified account found with this email",
      });
    }

    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.passwordResetOtpHash =
      otpHash;

    user.passwordResetOtpExpiresAt =
      otpExpiresAt;

    await user.save();

    try {
      await sendPasswordResetEmail({
        toEmail: user.email,
        toName: user.name,
        otp,
      });
    } catch (emailError) {
      console.error(
        "Password reset email error:",
        emailError
      );

      // Do not leave a valid reset OTP
      user.passwordResetOtpHash =
        null;

      user.passwordResetOtpExpiresAt =
        null;

      await user.save();

      return res.status(502).json({
        message:
          "Password reset email could not be sent. Please try again.",
      });
    }

    return res.status(200).json({
      message:
        "Password reset OTP sent to your email",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while requesting password reset",
    });
  }
}

// ===============================
// RESET PASSWORD
// ===============================

async function resetPassword(req, res) {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanOtp =
      String(otp).trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user || !user.isVerified) {
      return res.status(404).json({
        message:
          "Verified account not found",
      });
    }

    if (
      !user.passwordResetOtpHash ||
      !user.passwordResetOtpExpiresAt
    ) {
      return res.status(400).json({
        message:
          "No password reset OTP is available. Please request a new OTP.",
      });
    }

    if (
      user.passwordResetOtpExpiresAt.getTime() <
      Date.now()
    ) {
      user.passwordResetOtpHash =
        null;

      user.passwordResetOtpExpiresAt =
        null;

      await user.save();

      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    const incomingOtpHash =
      hashOtp(cleanOtp);

    if (
      incomingOtpHash !==
      user.passwordResetOtpHash
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    // Update the EXISTING account.
    // Existing jobs/data remain connected to user._id.
    user.password =
      hashedPassword;

    // OTP becomes unusable after successful reset.
    user.passwordResetOtpHash =
      null;

    user.passwordResetOtpExpiresAt =
      null;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while resetting password",
    });
  }
}

module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationOtp,
  loginUser,
  forgotPassword,
  resetPassword,
};