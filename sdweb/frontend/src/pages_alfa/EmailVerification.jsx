import { useEffect, useState } from "react";
import"./EmailVerification.css";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function EmailVerification() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_URL}/api/users/verify-email?token=${encodeURIComponent(
            token
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Email verification failed"
          );
        }

        setVerified(true);

        setMessage(
          "Verification Completed"
        );
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const sendVerificationLink = async () => {
    if (!email) {
      setMessage("Email not found");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/users/send-verification`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send verification email"
        );
      }

      setMessage(
        "Verification link sent to your email."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-wrapper">
      <div className="verification-card">

        <div className="verification-logo">
          <img
            src="/images/logo.png"
            alt="HopeBridge logo"
          />

          HopeBridge
        </div>

        {verified ? (
          <>
            <h1>
              Verification Completed
            </h1>

            <p className="subtitle">
              Your email has been successfully
              verified.
            </p>

            <div className="verification-message">
              <i className="fa-solid fa-circle-check"></i>{" "}
              Email Verified
            </div>

            <button
              className="verification-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Continue to Login
            </button>
          </>
        ) : (
          <>
            <h1>
              Verify Your Email
            </h1>

            <p className="subtitle">
              You need to verify your email
              first to get started.
            </p>

            {email && (
              <div className="email-box">
                <i className="fa-regular fa-envelope"></i>

                <span>
                  {email}
                </span>
              </div>
            )}

            {message && (
              <div className="verification-message">
                {message}
              </div>
            )}

            <button
              className="verification-btn"
              onClick={
                sendVerificationLink
              }
              disabled={loading}
            >
              <i className="fa-regular fa-envelope"></i>{" "}

              {loading
                ? "Sending..."
                : "Send Verification Link"}
            </button>

            <button
              className="back-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Back
            </button>
          </>
        )}

      </div>
    </div>
  );
}
