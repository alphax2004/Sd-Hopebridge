import { useState } from "react";
import LandingPage from "./pages_alfa/landingpage";
import Login from "./pages_alfa/login";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <style>{`
        :root {
          --text-color: #000;
          --primary-orange: rgb(238, 169, 41);
          --card-bg: #f6e9cc;
          --cream-bg: #fbf3e3;
        }

        * {
          box-sizing: border-box;
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100vh;
        }

        body {
          font-family: Arial, sans-serif;
          color: var(--text-color);
        }

        h1, h2, h3, p, label, a, span {
          color: var(--text-color);
          font-weight: bold;
        }

        /* Navbar */

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
          background-color: rgb(248, 185, 69);
        }

        .nav-right {
          display: flex;
          gap: 12px;
        }

        /* Buttons */

        .btn-primary {
          background-color: var(--primary-orange);
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-primary:hover {
          background-color: rgb(242, 241, 239);
          border: 1px solid orange;
        }

        /* Hero */

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

        /* Features */

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
          background-color: var(--card-bg);
          padding: 20px;
          border-radius: 14px;
          text-align: left;
          min-height: 130px;
        }

        .card:hover {
          background-color: var(--primary-orange);
        }

        .icon-box {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgb(241, 220, 160);
          border-radius: 10px;
          font-size: 20px;
        }

        /* Login */

        .login-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--cream-bg);
        }

        .login-card {
          width: 420px;
          padding: 40px;
          background-color: white;
          border-radius: 20px;
          text-align: center;
        }

        .input-box {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 1px solid #f1dca0;
          border-radius: 10px;
          background-color: var(--cream-bg);
        }

        .input-box input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-weight: bold;
        }

        .submit-login-btn {
          width: 100%;
          padding: 14px;
          background-color: orange;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

      `}</style>

      {page === "home" && <LandingPage goTo={setPage} />}
      {page === "login" && <Login goTo={setPage} />}
    </div>
  );
}