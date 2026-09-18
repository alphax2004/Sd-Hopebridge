import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  reload,
} from "firebase/auth";

import { auth } from "../firebase";

import "./login.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");


    // ==========================================
    // STEP 1: Validate fields
    // ==========================================

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        "Email and Password are required"
      );

      return;
    }


    setLoading(true);


    try {

      // ========================================
      // STEP 2: Firebase login
      // ========================================

      const result =
        await signInWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );

      const firebaseUser =
        result.user;


      // ========================================
      // STEP 3: Reload Firebase user
      // Gets latest emailVerified status
      // ========================================

      await reload(firebaseUser);


      // ========================================
      // STEP 4: Check email verification
      // ========================================

      if (
        !firebaseUser.emailVerified
      ) {

        setError(
          "Please verify your email first."
        );


        // Send verification email again
        try {

          await sendEmailVerification(
            firebaseUser
          );

        } catch (emailError) {

          console.log(
            "Verification resend error:",
            emailError
          );

        }


        // Sign out unverified user
        await signOut(auth);

        return;
      }


      // ========================================
      // STEP 5: Get Firebase ID token
      // ========================================

      const firebaseToken =
        await firebaseUser.getIdToken(
          true
        );


      console.log(
        "Firebase token exists:",
        !!firebaseToken
      );


      // ========================================
      // STEP 6: Send token to backend
      // ========================================

      const res = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${firebaseToken}`,
          },

          credentials:
            "include",

          body: JSON.stringify({
            firebaseToken,
          }),
        }
      );


      // ========================================
      // STEP 7: Read backend response
      // ========================================

      const data =
        await res.json();


      console.log(
        "LOGIN RESPONSE:",
        data
      );


      // ========================================
      // STEP 8: Backend error
      // ========================================

      if (!res.ok) {

        setError(
          data.error ||
          data.message ||
          "Login failed"
        );

        await signOut(auth);

        return;
      }


      // ========================================
      // STEP 9: Check user information
      // ========================================

      if (!data.user) {

        setError(
          "User information not found"
        );

        await signOut(auth);

        return;
      }


      // ========================================
      // STEP 10: Get user role
      // ========================================

      const userRole =
        data.user.role;

      console.log(
        "USER ROLE:",
        userRole
      );


      // ========================================
      // STEP 11: Role-based navigation
      // ========================================

      if (
        userRole === "admin"
      ) {

        navigate(
          "/admin/dashboard"
        );

      } else {

        navigate(
          "/dashboard"
        );
      }


    } catch (error) {

      console.log(
        "LOGIN ERROR:",
        error
      );


      // ========================================
      // Firebase error handling
      // ========================================

      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        setError(
          "Invalid email or password"
        );

      } else if (
        error.code ===
        "auth/user-not-found"
      ) {

        setError(
          "No account found with this email"
        );

      } else if (
        error.code ===
        "auth/wrong-password"
      ) {

        setError(
          "Incorrect password"
        );

      } else if (
        error.code ===
        "auth/invalid-email"
      ) {

        setError(
          "Invalid email address"
        );

      } else if (
        error.code ===
        "auth/too-many-requests"
      ) {

        setError(
          "Too many attempts. Please try again later."
        );

      } else if (
        error.code ===
        "auth/network-request-failed"
      ) {

        setError(
          "Network error. Please check your internet connection."
        );

      } else {

        setError(
          error.message ||
          "Login failed. Please try again."
        );
      }


      // ========================================
      // Make sure Firebase is signed out
      // ========================================

      try {

        await signOut(auth);

      } catch (signOutError) {

        console.log(
          "SIGN OUT ERROR:",
          signOutError
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // UI
  // EXACT SAME UI
  // ==========================================

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


        <h1>
          Welcome Back
        </h1>


        <p className="subtitle">
          Login to your HopeBridge account
        </p>


        {error && (
          <p className="error-text">
            {error}
          </p>
        )}


        <label>
          Email Address
        </label>


        <div className="input-box">

          <i className="fa-regular fa-envelope"></i>


          <input
            type="email"
            placeholder=" Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            autoCapitalize="none"
            spellCheck="false"
          />

        </div>


        <label>
          Password
        </label>


        <div className="input-box">

          <i className="fa-solid fa-lock"></i>


          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder=" Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />


          <i
            className={
              showPassword
                ? "fa-regular fa-eye-slash"
                : "fa-regular fa-eye"
            }
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            style={{
              cursor: "pointer",
            }}
          ></i>

        </div>


        <div className="options">

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            Forgot Password
          </a>

        </div>


        <button
          className="submit-login-btn"
          disabled={loading}
          onClick={handleLogin}
        >

          <i className="fa-solid fa-right-from-bracket"></i>{" "}

          {loading
            ? "Logging in..."
            : "Login"}

        </button>


        <p className="signup-text">

          Don't have an account?{" "}


          <a
            href="#"
            onClick={(e) => {

              e.preventDefault();

              navigate(
                "/register"
              );

            }}
          >
            Create Account
          </a>

        </p>


        <button
          className="logout-back"
          onClick={() =>
            navigate("/")
          }
        >
          Back
        </button>


      </div>

    </div>
  );
}