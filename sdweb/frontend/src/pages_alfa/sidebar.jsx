import { useState, useSyncExternalStore } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "fa-grip" },
  { path: "/request-help", label: "Request Help", icon: "fa-hand-holding-heart" },
  { path: "/disaster-center", label: "Disaster Center", icon: "fa-triangle-exclamation" },
  { path: "/profile", label: "Profile", icon: "fa-user" },
];

/*
  Chhoto shared store — Sidebar r Topbar alada component হলেও
  ei state duijon share korte parbe, kono page file change na kore.
*/
let sidebarOpen = false;
let listeners = [];

function setSidebarOpenGlobal(value) {
  sidebarOpen = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return sidebarOpen;
}

function useSidebarOpen() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useSidebarOpen();

  const closeSidebar = () => setSidebarOpenGlobal(false);

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={closeSidebar}
      ></div>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="HopeBridge logo" />

          <div>
            <div className="sidebar-title">HopeBridge</div>
            <div className="sidebar-subtitle">Together We Save Lives</div>
          </div>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div
            className="sidebar-item logout"
            onClick={() => {
              closeSidebar();
              navigate("/logout", {
                state: { from: location.pathname },
              });
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({ title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="topbar">
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpenGlobal(true)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="topbar-text">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="profile-dropdown-wrapper">
        <div
          className="profile-section"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="profile-avatar">
            <i className="fa-solid fa-user"></i>
          </div>

          <span>Sanjida Islam</span>

          <i className="fa-solid fa-chevron-down"></i>
        </div>

        {showDropdown && (
          <div className="profile-dropdown">
            <div
              className="dropdown-item"
              onClick={() => {
                navigate("/profile");
                setShowDropdown(false);
              }}
            >
              <i className="fa-solid fa-user"></i>
              <span>Profile</span>
            </div>

            <div
              className="dropdown-item"
              onClick={() => {
                navigate("/password");
                setShowDropdown(false);
              }}
            >
              <i className="fa-solid fa-lock"></i>
              <span>Password</span>
            </div>

            <div
              className="dropdown-item dropdown-logout"
              onClick={() => {
                navigate("/logout", {
                  state: { from: location.pathname },
                });
                setShowDropdown(false);
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
