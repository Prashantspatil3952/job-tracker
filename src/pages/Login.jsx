import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
} from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showVerifyLink,
    setShowVerifyLink,
  ] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setShowVerifyLink(false);
    setLoading(true);

    try {
      const data =
        await loginUser({
          email: email
            .trim()
            .toLowerCase(),
          password,
        });

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);

      if (error.status === 403) {
        setShowVerifyLink(true);

        localStorage.setItem(
          "pendingVerificationEmail",
          email.trim().toLowerCase()
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Login</h1>

        <p>
          Login to your JobTracker account.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {showVerifyLink && (
          <p>
            <Link
              to={`/verify-email?email=${encodeURIComponent(
                email
              )}`}
            >
              Verify your email now
            </Link>
          </p>
        )}

        <form
          onSubmit={handleSubmit}
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(
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
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;