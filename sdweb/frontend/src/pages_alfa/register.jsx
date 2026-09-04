import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (
      !fullName ||
      !bloodGroup ||
      !role ||
      !email ||
      !phone ||
      !location ||
      !password ||
      !confirmPassword
    ) {
      setError("সব ঘর পূরণ করুন");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          email,
          password,
          bloodGroup,
          phone,
          location,
          role,
        }),
      });

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
        `/verify-email?email=${encodeURIComponent(email)}`
      );
    } catch (error) {
      console.log(error);

      setError(
        "Server এর সাথে যোগাযোগ করা যাচ্ছে না"
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
            placeholder=" Enter your full name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />
        </div>

        <label>Blood Group</label>

        <div className="input-box">
          <i className="fa-solid fa-droplet"></i>

          <select
            value={bloodGroup}
            onChange={(e) =>
              setBloodGroup(e.target.value)
            }
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
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >
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

        <label>Phone</label>

        <div className="input-box">
          <i className="fa-solid fa-phone"></i>

          <input
            type="text"
            placeholder=" Enter your phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />
        </div>

        <label>Location</label>

        <div className="input-box">
          <i className="fa-solid fa-location-dot"></i>

          <input
            type="text"
            placeholder=" Enter your location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
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

        <label>Confirm Password</label>

        <div className="input-box">
          <i className="fa-solid fa-lock"></i>

          <input
            type="password"
            placeholder=" Re-enter your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <i className="fa-regular fa-eye"></i>
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
