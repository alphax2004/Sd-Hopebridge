export default function LandingPage({ goTo }) {
  return (
    <div className="landing-page">

      <style>{`
        .landing-page {
          background: #efd194;
          width: 100%;
          min-height: 100vh;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
        }

        .brand-logo img {
          width: 28px;
          height: 28px;
        }

        .nav-links a {
          text-decoration: none;
          margin: 0 5px;
          padding: 8px 14px;
          border-radius: 6px;
        }

        .nav-links a:hover {
          background: rgb(248, 185, 69);
        }

        .nav-right {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background: var(--primary-orange);
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: rgb(242, 241, 239);
          border: 1px solid orange;
        }

        .hero {
          text-align: center;
          padding: 50px 20px 40px;
          background-image:
            linear-gradient(
              rgba(251,243,227,0.6),
              rgba(251,243,227,0.6)
            ),
            url("/images/flood.jpeg");
          background-size: cover;
          background-position: center;
        }

        .hero h1 {
          font-size: 40px;
        }

        .hero .btn-primary {
          margin-top: 20px;
        }

        .features {
          text-align: center;
          padding: 20px 20px 50px;
        }

        .features h2 {
          font-size: 30px;
        }

        .card-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          max-width: 1300px;
          margin: 25px auto;
        }

        .card {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 14px;
          text-align: left;
          min-height: 130px;
        }

        .card:hover {
          background: var(--primary-orange);
        }

        .icon-box {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(241, 220, 160);
          border-radius: 10px;
          font-size: 20px;
        }
      `}</style>

      <div className="navbar">

        <div className="logo brand-logo">
          <img src="/images/logo.png" alt="HopeBridge logo" />
          HopeBridge
        </div>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Contact</a>
        </div>

        <div className="nav-right">
          <button
            className="btn-primary"
            onClick={() => goTo("login")}
          >
            Login
          </button>

          <button
              className="btn-primary"
              onClick={() => goTo("register")}
          >
            Register
          </button>
        </div>

      </div>

      <div className="hero">
        <h1>Together We Save Lives During Disasters</h1>

        <p>
          Connecting disaster victims with NGOs through fast,
          organized and transparent relief management.
        </p>

        <button className="btn-primary">
          Request Help
        </button>
      </div>

      <div className="features">

        <h2>Key HopeBridge Features</h2>

        <p>Connecting disaster relief with real-time tools</p>

        <div className="card-container">

          <div className="card">
            <div className="icon-box">
              <i className="fa-solid fa-robot"></i>
            </div>
            <h3>AI Disaster Predictions</h3>
            <p>
              AI-powered forecasts help identify risk zones early.
            </p>
          </div>

          <div className="card">
            <div className="icon-box">
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>
            <h3>Volunteer Mobilization</h3>
            <p>
              Quickly organize volunteers where they are needed.
            </p>
          </div>

          <div className="card">
            <div className="icon-box">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h3>Rapid Aid Distribution</h3>
            <p>
              Fast logistics to deliver supplies without delay.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}