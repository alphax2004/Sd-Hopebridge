export default function LandingPage({ goTo }) {
  return (
    <div style={{ backgroundColor: "#efd194",width: "100%", minHeight: "100vh" }}>
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
          <button className="btn-primary" onClick={() => goTo("login")}>Login</button>
          <button className="btn-primary">Register</button>
        </div>
      </div>

      <div className="hero">
        <h1>Together We Save Lives During Disasters</h1>
        <p>Connecting disaster victims with NGOs through fast, organized and transparent relief management.</p>
        <button className="btn-primary">Request Help</button>
      </div>

      <div className="features">
        <h2>Key HopeBridge Features</h2>
        <p>Connecting disaster relief with real-time tools</p>

        <div className="card-container">
          <div className="card">
            <div className="icon-box"><i className="fa-solid fa-robot"></i></div>
            <h3>AI Disaster Predictions</h3>
            <p>AI-powered forecasts help identify risk zones early.</p>
          </div>

          <div className="card">
            <div className="icon-box"><i className="fa-solid fa-hand-holding-heart"></i></div>
            <h3>Volunteer Mobilization</h3>
            <p>Quickly organize volunteers where they are needed.</p>
          </div>

          <div className="card">
            <div className="icon-box"><i className="fa-solid fa-box-open"></i></div>
            <h3>Rapid Aid Distribution</h3>
            <p>Fast logistics to deliver supplies without delay.</p>
          </div>

          
        </div>
      </div>
    </div>
  );
}