import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  forgotPassword,
  resetPassword,
} from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] =
    useState(1);

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSendOtp(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await forgotPassword(
        email
          .trim()
          .toLowerCase()
      );

      setMessage(
        "OTP sent to your email. Check your inbox."
      );

      setStep(2);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email:
          email
            .trim()
            .toLowerCase(),
        otp,
        newPassword,
      });

      setMessage(
        "Password reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>
          Forgot Password
        </h1>

        {step === 1 && (
          <>
            <p>
              Enter the email address
              of your existing
              JobTracker account.
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            <form
              onSubmit={handleSendOtp}
              className="auth-form"
            >
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p>
              OTP sent to:
            </p>

            <p>
              <strong>
                {email}
              </strong>
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            <form
              onSubmit={
                handleResetPassword
              }
              className="auth-form"
            >
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                required
              />

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                required
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <p
          style={{
            marginTop: "18px",
          }}
        >
          <Link to="/login">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;  