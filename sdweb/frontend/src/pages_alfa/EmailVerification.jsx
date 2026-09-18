import { useNavigate, useSearchParams } from "react-router-dom";

export default function EmailVerification() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fbf3e3",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "14px",
          textAlign: "center",
          maxWidth: "450px",
        }}
      >
        <i
          className="fa-solid fa-envelope"
          style={{
            fontSize: "45px",
            marginBottom: "20px",
          }}
        ></i>

        <h2>Verify Your Email</h2>

        <p
          style={{
            marginTop: "15px",
            marginBottom: "10px",
          }}
        >
          Verification email has been sent to:
        </p>

        <strong>{email}</strong>

        <p
          style={{
            marginTop: "15px",
          }}
        >
          Open your email and click the verification link.
        </p>

        <p
          style={{
            marginTop: "15px",
            color: "#555",
          }}
        >
          After verification, go back to Login and login
          with your email and password.
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "rgb(240, 160, 12)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}