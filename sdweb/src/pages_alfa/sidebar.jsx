const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "fa-grip" },
  { key: "requestHelp", label: "Request Help", icon: "fa-hand-holding-heart" },
  { key: "disasterCenter", label: "Disaster Center", icon: "fa-triangle-exclamation" },
  { key: "profile", label: "Profile", icon: "fa-user" },
  { key: "logout", label: "Logout", icon: "fa-right-from-bracket" },
];

export function Sidebar({ goTo, current }) {
  return (
    <aside className="sidebar">
      <style>{sidebarCss}</style>

      <div className="sidebar-logo">
        <img src="/images/logo.png" alt="HopeBridge logo" />

        <div>
          <div className="sidebar-title">HopeBridge</div>
          <div className="sidebar-subtitle">Together We Save Lives</div>
        </div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`sidebar-item ${item.key === "logout" ? "logout" : ""} ${
              current === item.key ? "active" : ""
            }`}
            //ekhane on click korle...request help e jabe...
            onClick={() => goTo(item.key)}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function Topbar({ title, subtitle }) {
  return (
    <div className="topbar">
      <style>{topbarCss}</style>

      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="profile-section">
        <div className="profile-avatar">
          <i className="fa-solid fa-user"></i>
        </div>

        <span>Sanjida Islam</span>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
    </div>
  );
}

const sidebarCss = `
.sidebar {
  width: 250px;
  min-width: 250px;
  min-height: 100vh;
  background: white;
  border-right: 1px solid #eee;
  padding: 22px 18px;
  box-sizing: border-box;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 8px;
  margin-bottom: 22px;
}

.sidebar-logo img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  color: black;
  line-height: 1.1;
  margin-top: 25px;
}

.sidebar-subtitle {
  font-size: 11px;
  font-weight: bold;
  color: #555;
  margin-top: 2px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar-item {
  height: 43px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: bold;
  color: black;
  cursor: pointer;
}

.sidebar-item i {
  width: 18px;
  text-align: center;
}

.sidebar-item:hover {
  background: #f8b945;
}

.sidebar-item.active {
  background: var(--primary-orange);
}

.sidebar-item.logout {
  color: #e05555;
  margin-top: 10px;
}

.sidebar-item.logout:hover {
  background: #fde3e3;
}
`;

const topbarCss = `
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 65px;
  margin-bottom: 17px;
}

.topbar h2 {
  margin: 0;
  font-size: 25px;
  font-weight: bold;
  color: black;
}

.topbar p {
  margin: 5px 0 0;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 14px;
  font-weight: bold;
  color: black;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1dca0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d99e1f;
}
`;