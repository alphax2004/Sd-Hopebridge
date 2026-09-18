import { Sidebar, Topbar } from "../pages_alfa/sidebar";
import "./admin.css";

const shelters = [
  ["Shelter 1", 200, 150, 50, "Open"],
  ["Shelter 2", 150, 140, 10, "Open"],
  ["Shelter 3", 100, 100, 0, "Full"],
];

const volunteers = [
  ["Karim", "01711-000111", "Mirpur", "Assigned"],
  ["Rahim", "01811-000222", "Uttara", "Available"],
  ["Hasan", "01911-000333", "Dhanmondi", "Busy"],
];

const news = [
  ["fa-droplet", "Flood Alert", "Rising water levels reported in low-lying areas of Sylhet."],
  ["fa-wind", "Cyclone Preparedness", "Coastal shelters on standby ahead of expected cyclone landfall."],
  ["fa-house-chimney", "Shelter Notice", "Two new shelters opened in Cox's Bazar to accommodate victims."],
  ["fa-triangle-exclamation", "Emergency Safety Update", "Volunteers advised to follow updated evacuation protocol."],
];

export default function AdminDisasterCentre() {
  return (
    <div className="admin-layout">
      <Sidebar variant="admin" />

      <div className="main-content">
        <Topbar
          variant="admin"
          userName="Admin"
          title="Disaster Centre"
          subtitle="Monitor shelters, volunteers, and disaster news."
        />

        <div className="admin-card">
          <h3>Shelter Overview</h3>
          <div className="shelter-grid">
            {shelters.map(([name, capacity, occupied, available, status]) => (
              <div className="shelter-card" key={name}>
                <h4>{name}</h4>
                <p>Capacity: {capacity}</p>
                <p>Occupied: {occupied}</p>
                <p>Available: {available}</p>
                <span className={`badge ${status}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>Volunteers</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Assigned Area</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v[0]}>
                  <td>{v[0]}</td>
                  <td>{v[1]}</td>
                  <td>{v[2]}</td>
                  <td>
                    <span className={`badge ${v[3]}`}>{v[3]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h3>Disaster News</h3>
          <div className="news-grid">
            {news.map(([icon, title, text]) => (
              <div className="news-card" key={title}>
                <i className={`fa-solid ${icon}`}></i>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
