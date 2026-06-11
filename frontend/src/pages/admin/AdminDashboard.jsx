import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  FaHotel, FaBed, FaUsers, FaBookOpen, FaRupeeSign,
  FaClock, FaCheckCircle, FaTimesCircle, FaSignOutAlt,
  FaTachometerAlt, FaChartBar, FaConciergeBell,
} from "react-icons/fa";
import { getDashboardStats } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#f59e0b", "#10b981", "#ef4444", "#6b7280"];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const monthlyChartData = stats?.monthlyBookings?.map((m) => ({
    name: MONTHS[m._id.month - 1],
    Bookings: m.count,
    Revenue: m.revenue,
  })) || [];

  const pieData = [
    { name: "Pending",   value: stats?.pendingBookings   || 0 },
    { name: "Confirmed", value: stats?.confirmedBookings || 0 },
    { name: "Cancelled", value: stats?.cancelledBookings || 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaHotel style={{ color: "var(--accent)", fontSize: "1.4rem" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "white" }}>
              LuxeStay
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Admin Panel</p>
        </div>

        <nav style={{ padding: "16px 0" }}>
          {[
            { icon: <FaTachometerAlt />, label: "Dashboard",      to: "/admin" },
            { icon: <FaHotel />,         label: "Hotels",         to: "/admin/hotels" },
            { icon: <FaBed />,           label: "Rooms",          to: "/admin/rooms" },
            { icon: <FaBookOpen />,      label: "Bookings",       to: "/admin/bookings" },
            { icon: <FaUsers />,         label: "Users",          to: "/admin/users" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 24px", color: "rgba(255,255,255,0.75)",
                fontSize: "0.9rem", fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,168,76,0.15)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
            >
              <span style={{ color: "var(--accent)" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
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

      {/* ── Main Content ── */}
      <main className="admin-main">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--primary)", marginBottom: "4px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--gray-400)", marginBottom: "28px", fontSize: "0.9rem" }}>
            Welcome back! Here's what's happening today.
          </p>

          {loading ? <Spinner /> : (
            <>
              {/* ── Stat Cards ── */}
              <div className="grid-4" style={{ marginBottom: "28px" }}>
                {[
                  { icon: <FaUsers />,     label: "Total Users",     value: stats?.totalUsers,     color: "#3b82f6" },
                  { icon: <FaHotel />,     label: "Total Hotels",    value: stats?.totalHotels,    color: "#8b5cf6" },
                  { icon: <FaBed />,       label: "Total Rooms",     value: stats?.totalRooms,     color: "#f59e0b" },
                  { icon: <FaBookOpen />,  label: "Total Bookings",  value: stats?.totalBookings,  color: "#10b981" },
                  { icon: <FaClock />,     label: "Pending",         value: stats?.pendingBookings,   color: "#f59e0b" },
                  { icon: <FaCheckCircle />, label: "Confirmed",     value: stats?.confirmedBookings, color: "#10b981" },
                  { icon: <FaTimesCircle />, label: "Cancelled",     value: stats?.cancelledBookings, color: "#ef4444" },
                  { icon: <FaRupeeSign />, label: "Total Revenue",   value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: "#c9a84c" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: "white", borderRadius: "var(--radius-md)",
                      padding: "20px", boxShadow: "var(--shadow-sm)",
                      display: "flex", alignItems: "center", gap: "16px",
                    }}
                  >
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "12px",
                      background: `${s.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.2rem", color: s.color, flexShrink: 0,
                    }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {s.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Charts Row ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", marginBottom: "28px" }}>
                {/* Bar Chart */}
                <div style={{ background: "white", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "var(--primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaChartBar style={{ color: "var(--accent)" }} /> Monthly Bookings
                  </h3>
                  {monthlyChartData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>No data yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="Bookings" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Pie Chart */}
                <div style={{ background: "white", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "var(--primary)", marginBottom: "20px" }}>
                    Booking Status
                  </h3>
                  {pieData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>No data yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* ── Recent Bookings ── */}
              <div style={{ background: "white", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>Recent Bookings</h3>
                  <Link to="/admin/bookings" style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600 }}>View All →</Link>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Guest</th><th>Hotel</th><th>Check-In</th><th>Amount</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentBookings?.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: "center", color: "var(--gray-400)" }}>No bookings yet</td></tr>
                      ) : (
                        stats?.recentBookings?.map((b) => (
                          <tr key={b._id}>
                            <td style={{ fontWeight: 500 }}>{b.user?.name}</td>
                            <td>{b.hotel?.name}</td>
                            <td>{new Date(b.checkIn).toLocaleDateString("en-IN")}</td>
                            <td style={{ fontWeight: 600 }}>₹{b.totalPrice?.toLocaleString()}</td>
                            <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
