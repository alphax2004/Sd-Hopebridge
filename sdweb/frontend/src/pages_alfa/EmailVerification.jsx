import { useEffect, useState } from "react";
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
      <style>{`
        .verification-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image:
            linear-gradient(
              rgba(251,243,227,0.6),
              rgba(251,243,227,0.6)
            ),
            url("/images/flood.jpeg");
          background-size: cover;
          padding: 40px 20px;
        }

        .verification-card {
          width: 100%;
          max-width: 680px;
          padding: 60px 80px;
          background: #edd7ab;
          border-radius: 30px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .verification-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
        }

        .verification-logo img {
          width: 28px;
          height: 28px;
        }

        .verification-card h1 {
          font-size: 36px;
          line-height: 1.2;
          margin: 15px 0;
        }

        .verification-card .subtitle {
          margin-bottom: 20px;
        }

        .email-box {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 2px solid orange;
          border-radius: 10px;
          background: rgb(255, 255, 255);
        }

        .email-box i {
          margin-right: 10px;
        }

        .email-box span {
          flex: 1;
          font-weight: bold;
        }

        .verification-message {
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 2px solid orange;
          border-radius: 10px;
          background: rgb(255, 255, 255);
          font-weight: bold;
        }

        .verification-btn {
          width: 350px;
          margin: 5px auto 0;
          padding: 14px;
          background: var(--primary-orange);
          border: none;
          border-radius: 10px;
          font-weight: bold;
        }

        .verification-btn:disabled {
          opacity: 0.6;
        }

        .verification-btn:hover {
          background: rgb(255, 255, 255);
          border: 2px solid orange;
        }

        .back-btn {
          margin-top: 20px;
          padding: 9px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          background: var(--primary-orange);
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .back-btn:hover {
          background: rgb(255, 255, 255);
          border: 2px solid orange;
        }
      `}</style>

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