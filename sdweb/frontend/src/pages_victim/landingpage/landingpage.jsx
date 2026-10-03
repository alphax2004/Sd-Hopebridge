import { useNavigate } from "react-router-dom";
import "./landingpage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ========================================
          NAVBAR
      ======================================== */}

      <div className="navbar">
        <div className="brand-logo">
          <img src="/images/logo.png" alt="HopeBridge logo" />
          HopeBridge
        </div>

        {/*
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        */}

        <div className="nav-right">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="btn-primary" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>

      {/* ========================================
          HERO
      ======================================== */}

      <div className="hero">
        <h1>Together We Save Lives During Disasters</h1>

        <p>
          Connecting disaster victims with NGOs through fast, organized and
          transparent relief management.
        </p>

        <button className="btn-primary" onClick={() => navigate("/login")}>
          Request Help
        </button>
      </div>

      {/* ========================================
          FEATURES
      ======================================== */}

      <div className="features">
        <h2>Powering Faster, Smarter Disaster Response</h2>

        <p className="features-subtitle">
          One connected platform to request help, coordinate relief and access
          critical disaster information.
        </p>

        <div className="card-container">
          {/* FEATURE 1 */}

          <div className="card">
            <div className="icon-box icon-help">
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>

            <h3>Emergency Aid Requests</h3>

            <p>
              Submit requests for food, water, shelter or medical assistance
              with urgency and location details.
            </p>
          </div>

          {/* FEATURE 2 */}

          <div className="card">
            <div className="icon-box icon-track">
              <i className="fa-solid fa-list-check"></i>
            </div>

            <h3>Request Tracking</h3>

            <p>
              Track every submitted request from pending review to approval or
              rejection with clear status updates.
            </p>
          </div>

          {/* FEATURE 3 */}

          <div className="card">
            <div className="icon-box icon-coordinate">
              <i className="fa-solid fa-users-gear"></i>
            </div>

            <h3>Centralized Relief Coordination</h3>

            <p>
              Give relief administrators one organized system to review,
              prioritize and manage incoming requests.
            </p>
          </div>

          {/* FEATURE 4 */}

          <div className="card">
            <div className="icon-box icon-disaster">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h3>Live Disaster Information</h3>

            <p>
              Access active disaster updates, affected locations and essential
              information from one central hub.
            </p>
          </div>

          {/* FEATURE 5 */}

          <div className="card">
            <div className="icon-box icon-shelter">
              <i className="fa-solid fa-house-chimney"></i>
            </div>

            <h3>Smart Shelter Information</h3>

            <p>
              View shelter locations, capacity and occupancy to help people find
              available emergency accommodation.
            </p>
          </div>

          {/* FEATURE 6 */}

          <div className="card">
            <div className="icon-box icon-security">
              <i className="fa-solid fa-shield-halved"></i>
            </div>

            <h3>Secure & Verified Access</h3>

            <p>
              Email verification, protected routes and role-based access help
              keep users and relief data secure.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
    CONTACT SECTION
======================================== */}

      {/* ========================================
    CONTACT SECTION
======================================== */}

      <div className="contact-section">
        <div className="contact-content">
          <div className="contact-info">
            <span className="contact-label">CONTACT US</span>

            <h2>Need Help or Have Questions?</h2>

            <p>
              Reach out to HopeBridge for support, feedback or disaster relief
              information.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>support@hopebridge.com</span>
              </div>

              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>+880 1XXX-XXXXXX</span>
              </div>

              <div className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          
        </div>

        
      </div>
    </div>
  );
}
