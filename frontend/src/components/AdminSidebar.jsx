import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHotel, FaBed, FaUsers, FaBookOpen,
  FaTachometerAlt, FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  const links = [
    { icon: <FaTachometerAlt />, label: "Dashboard",  to: "/admin" },
    { icon: <FaHotel />,         label: "Hotels",     to: "/admin/hotels" },
    { icon: <FaBed />,           label: "Rooms",      to: "/admin/rooms" },
    { icon: <FaBookOpen />,      label: "Bookings",   to: "/admin/bookings" },
    { icon: <FaUsers />,         label: "Users",      to: "/admin/users" },
  ];

  return (
    <aside className="admin-sidebar">
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaHotel style={{ color: "var(--accent)", fontSize: "1.4rem" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "white" }}>
            LuxeStay
          </span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Admin Panel</p>
      </div>

      <nav style={{ padding: "8px 0" }}>
        {links.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 24px",
                color: active ? "var(--accent)" : "rgba(255,255,255,0.75)",
                background: active ? "rgba(201,168,76,0.15)" : "transparent",
                fontSize: "0.9rem", fontWeight: active ? 600 : 500,
                borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "var(--accent)" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ position: "absolute", bottom: "24px", left: 0, right: 0, padding: "0 24px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5", padding: "10px 16px", borderRadius: "8px",
            cursor: "pointer", fontSize: "0.9rem",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
