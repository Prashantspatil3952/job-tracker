const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");

const {
  sendVerificationEmail,
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

async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
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
        message: "Email is already verified",
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
    user.verificationOtpHash = null;
    user.verificationOtpExpiresAt = null;

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
        message: "Email is already verified",
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
      message: "Login successful",
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

module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationOtp,
  loginUser,
};