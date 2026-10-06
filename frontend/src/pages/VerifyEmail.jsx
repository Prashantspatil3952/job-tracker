import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  verifyEmail,
  resendVerificationOtp,
} from "../services/api";

function VerifyEmail() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const initialEmail =
    searchParams.get("email") ||
    localStorage.getItem(
      "pendingVerificationEmail"
    ) ||
    "";

  const [email, setEmail] =
    useState(initialEmail);

  const [otp, setOtp] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  async function handleVerify(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await verifyEmail({
        email: email
          .trim()
          .toLowerCase(),
        otp,
      });

      localStorage.removeItem(
        "pendingVerificationEmail"
      );

      setMessage(
        "Email verified successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setResending(true);

    try {
      await resendVerificationOtp(
        email
          .trim()
          .toLowerCase()
      );

      setMessage(
        "A new OTP has been sent to your email."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Verify Email</h1>

        <p>
          Enter the 6-digit OTP sent to
          your email.
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
          onSubmit={handleVerify}
          className="auth-form"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(event) =>
              setOtp(
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            maxLength={6}
            inputMode="numeric"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="secondary-button"
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </button>

        <p>
          <Link to="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;