import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

import "./Register.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] =
    useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");


    // ==========================================
    // STEP 1: Check required fields
    // ==========================================

    if (
      !fullName.trim() ||
      !bloodGroup ||
      !role ||
      !email.trim() ||
      !phone.trim() ||
      !location.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Fill all the required fields"
      );

      return;
    }


    // ==========================================
    // STEP 2: Check password match
    // ==========================================

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );

      return;
    }


    // ==========================================
    // STEP 3: Check password length
    // ==========================================

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );

      return;
    }


    setLoading(true);


    try {

      // ========================================
      // STEP 4: Create Firebase account
      // ========================================

      const result =
        await createUserWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );

      const firebaseUser =
        result.user;


      // ========================================
      // STEP 5: Send verification email
      // ========================================

      await sendEmailVerification(
        firebaseUser
      );


      // ========================================
      // STEP 6: Get Firebase ID token
      // ========================================

      const firebaseToken =
        await firebaseUser.getIdToken();


      // ========================================
      // STEP 7: Save profile in MongoDB
      // ========================================

      const res = await fetch(
        `${API_URL}/api/users`,
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
            fullName:
              fullName.trim(),

            bloodGroup,

            phone:
              phone.trim(),

            location:
              location.trim(),

            role,
          }),
        }
      );


      // ========================================
      // STEP 8: Read backend response
      // ========================================

      const data =
        await res.json();


      // ========================================
      // STEP 9: Backend error
      // ========================================

      if (!res.ok) {

        await signOut(auth);

        setError(
          data.message ||
          data.error ||
          "Registration failed"
        );

        return;
      }


      // ========================================
      // STEP 10: Sign out Firebase
      // User must verify email first
      // ========================================

      await signOut(auth);


      // ========================================
      // STEP 11: Go to verification page
      // ========================================

      navigate(
        `/verify-email?email=${encodeURIComponent(
          email.trim().toLowerCase()
        )}`
      );

    } catch (error) {

      console.log(
        "REGISTER ERROR:",
        error
      );


      // ========================================
      // Firebase errors
      // ========================================

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {

        setError(
          "This email is already registered"
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
        "auth/weak-password"
      ) {

        setError(
          "Password is too weak"
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
          "Registration failed"
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="register-wrapper">

      <div className="register-card">


        <div className="register-logo">

          <img
            src="/images/logo.png"
            alt="HopeBridge logo"
          />

          HopeBridge

        </div>


        <h1>
          Create Account
        </h1>


        <p className="subtitle">
          Register for a HopeBridge account
        </p>


        {error && (
          <p className="error-text">
            {error}
          </p>
        )}


        <label>
          Full Name
        </label>


        <div className="input-box">

          <i className="fa-regular fa-user"></i>


          <input
            type="text"
            placeholder=" Enter your full name"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            autoComplete="off"
          />

        </div>


        <label>
          Blood Group
        </label>


        <div className="input-box">

          <i className="fa-solid fa-droplet"></i>


          <select
            value={bloodGroup}
            onChange={(e) =>
              setBloodGroup(
                e.target.value
              )
            }
          >

            <option
              value=""
              disabled
            >
              Select your blood group
            </option>


            <option value="A+">
              A+
            </option>

            <option value="A-">
              A-
            </option>

            <option value="B+">
              B+
            </option>

            <option value="B-">
              B-
            </option>

            <option value="AB+">
              AB+
            </option>

            <option value="AB-">
              AB-
            </option>

            <option value="O+">
              O+
            </option>

            <option value="O-">
              O-
            </option>

          </select>

        </div>


        <label>
          Role
        </label>


        <div className="input-box">

          <i className="fa-solid fa-user-tag"></i>


          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
          >

            <option
              value=""
              disabled
            >
              Select your role
            </option>


            <option value="user">
              User
            </option>


            <option value="ngo">
              NGO
            </option>


            <option value="admin">
              Admin
            </option>

          </select>

        </div>


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
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
          />

        </div>


        <label>
          Phone
        </label>


        <div className="input-box">

          <i className="fa-solid fa-phone"></i>


          <input
            type="text"
            placeholder=" Enter your phone number"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            autoComplete="off"
          />

        </div>


        <label>
          Location
        </label>


        <div className="input-box">

          <i className="fa-solid fa-location-dot"></i>


          <input
            type="text"
            placeholder=" Enter your location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            autoComplete="off"
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
            autoComplete="new-password"
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


        <label>
          Confirm Password
        </label>


        <div className="input-box">

          <i className="fa-solid fa-lock"></i>


          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder=" Re-enter your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            autoComplete="new-password"
          />


          <i
            className={
              showConfirmPassword
                ? "fa-regular fa-eye-slash"
                : "fa-regular fa-eye"
            }
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            style={{
              cursor: "pointer",
            }}
          ></i>

        </div>


        <button
          className="submit-register-btn"
          disabled={loading}
          onClick={handleRegister}
        >

          <i className="fa-solid fa-user-plus"></i>{" "}

          {loading
            ? "Creating..."
            : "Register"}

        </button>


        <p className="login-text">

          Already have an account?{" "}


          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();

              navigate("/login");
            }}
          >
            Login
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