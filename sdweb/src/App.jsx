import { useState } from "react";
import LandingPage from "./pages_alfa/landingpage";
import Login from "./pages_alfa/login";
import Register from "./pages_alfa/Register";   
import Dashboard from "./pages_alfa/Dashboard";
import Logout from "./pages_alfa/logout";
import RequestHelp from "./pages_alfa/RequestHelp";
import Profile from "./pages_alfa/Profile";
import DisasterCenter from "./pages_alfa/DisasterCenter";

export default function App() {
  const [page, setPage] = useState("home");
  const [cameFrom, setCameFrom] = useState("dashboard");

  const goTo = (newPage) => {
    if (newPage === "logout") {
      setCameFrom(page);
    }

    setPage(newPage);
  };

  return (
     <div style={{ width: "100%", minHeight: "100vh" }}>
      <style>{`
        :root {
          --text-color: #000;
          --primary-orange: rgb(238, 169, 41);
          --card-bg: #f6e9cc;
          --cream-bg: #fbf3e3;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
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

        button {
          font-family: Arial, sans-serif;
          color: black;
          font-weight: bold;
        }
      `}</style>

      {page === "home" && <LandingPage goTo={goTo} />}
      {page === "login" && <Login goTo={goTo} />}
      {page === "register" && <Register goTo={goTo} />}   {/* 👈 নতুন route */}
      {page === "requestHelp" && <RequestHelp goTo={goTo} />}
      {page === "profile" && <Profile goTo={goTo} />}
      {page === "dashboard" && <Dashboard goTo={goTo} />}
      {page === "disasterCenter" && <DisasterCenter goTo={goTo} />}
      {page === "logout" && <Logout goTo={goTo} cameFrom={cameFrom} />}
    </div>
  );
}