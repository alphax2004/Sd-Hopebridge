import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    const actualFullName =
      document.querySelector(
        'input[name="fullName"]'
      )?.value?.trim() || "";

    const actualBloodGroup =
      document.querySelector(
        'select[name="bloodGroup"]'
      )?.value || "";

    const actualRole =
      document.querySelector(
        'select[name="role"]'
      )?.value || "";

    const actualEmail =
      document.querySelector(
        'input[name="email"]'
      )?.value?.trim() || "";

    const actualPhone =
      document.querySelector(
        'input[name="phone"]'
      )?.value?.trim() || "";

    const actualLocation =
      document.querySelector(
        'input[name="location"]'
      )?.value?.trim() || "";

    const actualPassword =
      document.querySelector(
        'input[name="password"]'
      )?.value || "";

    const actualConfirmPassword =
      document.querySelector(
        'input[name="confirmPassword"]'
      )?.value || "";

    if (
      !actualFullName ||
      !actualBloodGroup ||
      !actualRole ||
      !actualEmail ||
      !actualPhone ||
      !actualLocation ||
      !actualPassword ||
      !actualConfirmPassword
    ) {
      setError("Fill all the required fields");
      return;
    }

    if (
      actualPassword !==
      actualConfirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: actualFullName,
            email: actualEmail.toLowerCase(),
            password: actualPassword,
            bloodGroup: actualBloodGroup,
            phone: actualPhone,
            location: actualLocation,
            role: actualRole,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            data.message ||
            "Registration failed"
        );
        return;
      }

      navigate(
        `/verify-email?email=${encodeURIComponent(
          actualEmail.toLowerCase()
        )}`
      );
    } catch (error) {
      console.log(error);

      setError(
        "Failed to connect with the server"
      );
    } finally {
      setLoading(false);
    }
  };

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

        <h1>Create Account</h1>

        <p className="subtitle">
          Register for a HopeBridge account
        </p>

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <label>Full Name</label>

        <div className="input-box">
          <i className="fa-regular fa-user"></i>

          <input
            type="text"
            name="fullName"
            placeholder=" Enter your full name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            autoComplete="off"
          />
        </div>

        <label>Blood Group</label>

        <div className="input-box">
          <i className="fa-solid fa-droplet"></i>

          <select
            name="bloodGroup"
            value={bloodGroup}
            onChange={(e) =>
              setBloodGroup(e.target.value)
            }
            autoComplete="off"
          >
            <option value="" disabled>
              Select your blood group
            </option>

            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <label>Role</label>

        <div className="input-box">
          <i className="fa-solid fa-user-tag"></i>

          <select
            name="role"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            autoComplete="off"
          >
            <option value="" disabled>
              Select your role
            </option>

            <option value="user">User</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <label>Email Address</label>

        <div className="input-box">
          <i className="fa-regular fa-envelope"></i>

          <input
            type="email"
            name="email"
            placeholder=" Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
          />
        </div>

        <label>Phone</label>

        <div className="input-box">
          <i className="fa-solid fa-phone"></i>

          <input
            type="text"
            name="phone"
            placeholder=" Enter your phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            autoComplete="off"
          />
        </div>

        <label>Location</label>

        <div className="input-box">
          <i className="fa-solid fa-location-dot"></i>

          <input
            type="text"
            name="location"
            placeholder=" Enter your location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            autoComplete="off"
          />
        </div>

        <label>Password</label>

        <div className="input-box">
          <i className="fa-solid fa-lock"></i>

          <input
            type="password"
            name="password"
            placeholder=" Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="new-password"
          />

          
  <i
    className={
      showPassword
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye"
    }
    onClick={() => setShowPassword(!showPassword)}
    style={{ cursor: "pointer" }}
  ></i>
        </div>

        <label>Confirm Password</label>

        <div className="input-box">
          <i className="fa-solid fa-lock"></i>

          <input
            type="password"
            name="confirmPassword"
            placeholder=" Re-enter your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            autoComplete="new-password"
          />

          
  <i
    className={
      showConfirmPassword
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye"
    }
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    style={{ cursor: "pointer" }}
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
          onClick={() => navigate("/")}
        >
          Back
        </button>

      </div>
    </div>
  );
}