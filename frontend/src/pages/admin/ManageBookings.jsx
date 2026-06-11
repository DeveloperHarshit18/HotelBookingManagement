import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaCheckCircle, FaTimesCircle, FaBan, FaSearch, FaBookOpen,
} from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";
import { getAllBookings, updateBookingStatus } from "../../services/api";

const STATUS_FILTERS = ["all", "pending", "confirmed", "cancelled", "rejected"];

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState("all");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getAllBookings()
      .then((r) => { setBookings(r.data); setFiltered(r.data); })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  // Filter whenever search or status changes
  useEffect(() => {
    let result = [...bookings];
    if (statusF !== "all") result = result.filter((b) => b.status === statusF);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.user?.name?.toLowerCase().includes(q) ||
          b.hotel?.name?.toLowerCase().includes(q) ||
          b._id?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusF, bookings]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      toast.success(`Booking ${status}!`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const statusColors = {
    pending:   { bg: "#fef3c7", color: "#92400e" },
    confirmed: { bg: "#d1fae5", color: "#065f46" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" },
    rejected:  { bg: "#f3f4f6", color: "#374151" },
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--primary)" }}>
              Manage Bookings
            </h1>
            <p style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>
              {bookings.length} total bookings
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", background: "white", borderRadius: "8px", padding: "0 14px", gap: "8px", boxShadow: "var(--shadow-sm)", flex: 1, minWidth: "200px" }}>
              <FaSearch style={{ color: "var(--gray-400)" }} />
              <input
                type="text"
                placeholder="Search by guest, hotel or booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", padding: "10px 0", fontSize: "0.9rem", width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusF(s)}
                  style={{
                    padding: "8px 16px", borderRadius: "8px", border: "none",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                    textTransform: "capitalize",
                    background: statusF === s ? "var(--primary)" : "white",
                    color: statusF === s ? "white" : "var(--gray-600)",
                    boxShadow: "var(--shadow-sm)",
                    transition: "all 0.2s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <Spinner />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "48px", color: "var(--gray-400)" }}>
                        <FaBookOpen style={{ fontSize: "2rem", marginBottom: "8px", display: "block", margin: "0 auto 8px" }} />
                        No bookings found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b) => {
                      const sc = statusColors[b.status] || statusColors.pending;
                      const isUpdating = updating === b._id;
                      return (
                        <tr key={b._id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600, color: "var(--gray-800)" }}>{b.user?.name}</div>
                              <div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>{b.user?.email}</div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 500 }}>{b.hotel?.name}</td>
                          <td style={{ color: "var(--gray-600)" }}>{b.room?.title || "—"}</td>
                          <td>{new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</td>
                          <td>{new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</td>
                          <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{b.totalPrice?.toLocaleString()}</td>
                          <td>
                            <span style={{ background: sc.bg, color: sc.color, padding: "4px 10px", borderRadius: "12px", fontSize: "0.78rem", fontWeight: 700, textTransform: "capitalize" }}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            {b.status === "pending" && (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  onClick={() => handleStatus(b._id, "confirmed")}
                                  disabled={isUpdating}
                                  title="Confirm"
                                  style={{ background: "#d1fae5", color: "#065f46", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", fontWeight: 600 }}
                                >
                                  <FaCheckCircle /> {isUpdating ? "…" : "Confirm"}
                                </button>
                                <button
                                  onClick={() => handleStatus(b._id, "rejected")}
                                  disabled={isUpdating}
                                  title="Reject"
                                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", fontWeight: 600 }}
                                >
                                  <FaTimesCircle /> Reject
                                </button>
                              </div>
                            )}
                            {b.status === "confirmed" && (
                              <button
                                onClick={() => handleStatus(b._id, "cancelled")}
                                disabled={isUpdating}
                                style={{ background: "#fef3c7", color: "#92400e", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", fontWeight: 600 }}
                              >
                                <FaBan /> Cancel
                              </button>
                            )}
                            {(b.status === "cancelled" || b.status === "rejected") && (
                              <span style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>No action</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ManageBookings;
