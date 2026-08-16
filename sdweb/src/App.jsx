import { useState } from "react";
import LandingPage from "./pages_alfa/landingpage";
import Login from "./pages_alfa/login";
import Dashboard from "./pages_alfa/Dashboard";
import Logout from "./pages_alfa/logout";
import RequestHelp from "./pages_mehreen/RequestHelp";
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
    <div>
      //common jinish shob jaygay eki color font use hobe....just call kora hobe
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

        button {
          font-family: Arial, sans-serif;
          color: black;
          font-weight: bold;
        }
      `}</style>

      //ekhan theke page e jay...ek page theke arek page..
      //home to login...login to dashboard..

      {page === "home" && <LandingPage goTo={goTo} />}
      {page === "login" && <Login goTo={goTo} />}  //ekhane login page theke...age by defalt dashboard e jabe

      
      //then side bar e click kore request help,disaster center,profile e jabe....

      {[
        "dashboard",
        "requestHelp",
        "disasterCenter",
        "profile",
        
      ].includes(page) && <Dashboard goTo={goTo} />}
      {page === "requestHelp" && <RequestHelp goTo={goTo} />}

      {page === "logout" && (
        <Logout goTo={goTo} cameFrom={cameFrom} />
      )}
    </div>
  );
}