export default function Login({ goTo }) {
  return (
    <div className="login-wrapper">

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
        }

        .login-image {
          flex: 1;
          background-image: url("/images/flood.jpeg");
          background-size: cover;
          background-position: center;
        }

        .login-card {
          flex: 1;
          padding: 60px 80px;
          background: #ecd4a3;
          //border-radius: 30px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
        }

        .login-logo img {
          width: 28px;
          height: 28px;
        }

        .login-card h1 {
          font-size: 36px;
          line-height: 1.2;
          margin: 15px 0px 30px;
        }

        .login-card .subtitle {
          margin-bottom: 20px;
        }

        .login-card label {
          display: block;
          margin-bottom: 8px;
        }

        .input-box {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 2px solid #9a8447;
          border-radius: 10px;
          background: var(--cream-bg);
        }

        .input-box input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-weight: bold;
        }

        .options {
          text-align: right;
          margin-bottom: 15px;
          
        }

        

        .options a:hover {
          color: red;
        }

        .submit-login-btn {
          width: 100%;
          padding: 14px;
          background: orange;
          //border: none;
          border-radius: 10px;
         // cursor: pointer;
        }

        .submit-login-btn:hover {
          background: rgb(242, 241, 239);
          border: 2px solid orange;
        }

        .signup-text {
          text-align: center;
        }

        

        .signup-text a:hover {
          color: red;
        }
      `}</style>

      <div className="login-image"></div>

      <div className="login-card">

        <div className="login-logo">
          <img src="/images/logo.png" alt="HopeBridge logo" />
          HopeBridge
        </div>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to your HopeBridge account
        </p>

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

        <div className="options">
          <a
            href="#">
            Forgot Password
          </a>
        </div>

        <button
          className="submit-login-btn"
          onClick={() => goTo("dashboard")}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          {" "}Login
        </button>

        <p className="signup-text">
          Don't have an account?{"  "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goTo("register");
            }}
          >
            Create Account
          </a>
        </p>

      </div>
    </div>
  );
}