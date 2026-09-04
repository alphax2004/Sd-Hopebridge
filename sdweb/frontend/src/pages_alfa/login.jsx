import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email এবং Password দিন");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Login successful
      navigate("/dashboard");
    } catch {
      setError("Server এর সাথে যোগাযোগ করা যাচ্ছে না");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image"></div>

      <div className="login-card">
        <div className="login-logo">
          <img
            src="/images/logo.png"
            alt="HopeBridge logo"
          />
          HopeBridge
        </div>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to your HopeBridge account
        </p>

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <label>Email Address</label>

        <div className="input-box">
          <i className="fa-regular fa-envelope"></i>

          <input
            type="email"
            placeholder=" Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <label>Password</label>

        <div className="input-box">
          <i className="fa-solid fa-lock"></i>

          <input
            type="password"
            placeholder=" Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <i className="fa-regular fa-eye"></i>
        </div>

        <div className="options">
          <a href="#">Forgot Password</a>
        </div>

        <button
          className="submit-login-btn"
          disabled={loading}
          onClick={handleLogin}
        >
          <i className="fa-solid fa-right-from-bracket"></i>{" "}
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signup-text">
          Don't have an account?{" "}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Create Account
          </a>
        </p>

        <button
          className="logout-back"
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
    </div>
  );
}
