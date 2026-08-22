export default function Register({ goTo }) {
  return (
    <div className="register-wrapper">

      <style>{`
        .register-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          //background: #ecd4a3;
           background-image:
            linear-gradient(
              rgba(251,243,227,0.6),
              rgba(251,243,227,0.6)
            ),
            url("/images/flood.jpeg");
          background-size: cover;
          padding: 40px 20px;
        }

        .register-card {
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

        .register-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
        }

        .register-logo img {
          width: 28px;
          height: 28px;
        }

        .register-card h1 {
          font-size: 36px;
          line-height: 1.2;
          margin: 15px 0;
        }

        .register-card .subtitle {
          margin-bottom: 20px;
        }

        .register-card label {
          display: block;
          margin-bottom: 8px;
        }

        .input-box {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 2px solid orange;
          border-radius: 10px;
          background: rgb(255, 255, 255);
        }

        .input-box input,
        .input-box select {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-weight: bold;
        }

        // .input-box select {
        //   appearance: none;
        //   //-webkit-appearance: none;
        //   //-moz-appearance: none;
        //   cursor: pointer;
        // }

        .submit-register-btn {
          width: 350px;
          margin: 0 auto;
          padding: 14px;
          background: var(--primary-orange);
          border: none;
          border-radius: 10px;
         
          margin-top: 5px;
        }

        .submit-register-btn:hover {
          background: rgb(255, 255, 255);
          border: 2px solid orange;
        }

        .login-text {
          text-align: center;
          margin-top: 15px;
        }

        .login-text a {
          //text-decoration: none;
          font-weight: bold;
          color: red;
          //transition: color 0.2s ease, text-decoration-color 0.2s ease;
        }

        .login-text a:hover {
          color: rgb(146, 88, 0);
          text-decoration: underline;
        }
      `}</style>

      <div className="register-card">

        <div className="register-logo">
          <img src="/images/logo.png" alt="HopeBridge logo" />
          HopeBridge
        </div>

        <h1>Create Account</h1>

        <p className="subtitle">
          Register for a HopeBridge account
        </p>

        <label>Full Name</label>

        <div className="input-box">
          <i className="fa-regular fa-user"></i>
          <input
            type="text"
            placeholder=" Enter your full name"
          />
        </div>

        <label>Blood Group</label>

        <div className="input-box">
          <i className="fa-solid fa-droplet"></i>
          <select defaultValue="">
            <option value="" disabled>Select your blood group</option>
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

        <label>Email Address</label>

        <div className="input-box">
          <i className="fa-regular fa-envelope"></i>
          <input
            type="email"
            placeholder=" Enter your email"
          />
        </div>

        <label>Password</label>

        <div className="input-box">
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            placeholder=" Enter your password"
          />
          <i className="fa-regular fa-eye"></i>
        </div>

        <label>Confirm Password</label>

        <div className="input-box">
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            placeholder=" Re-enter your password"
          />
          <i className="fa-regular fa-eye"></i>
        </div>

        <button
          className="submit-register-btn"
          onClick={() => goTo("dashboard")}
        >
          <i className="fa-solid fa-user-plus"></i>
          {" "}Register
        </button>

        <p className="login-text">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goTo("login");
            }}
          >
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
