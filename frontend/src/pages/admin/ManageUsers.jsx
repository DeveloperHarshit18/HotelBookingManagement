import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaTrash, FaSearch, FaUsers, FaUserCircle } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";
import { getAllUsers, deleteUser } from "../../services/api";

const ManageUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then((r) => { setUsers(r.data); setFiltered(r.data); })
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action is irreversible.")) return;
    setDeleting(id);
    try {
      await deleteUser(id);
      setUsers((p) => p.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--primary)" }}>
              Manage Users
            </h1>
            <p style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>
              {users.length} registered users
            </p>
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", background: "white", borderRadius: "8px", padding: "0 14px", gap: "8px", boxShadow: "var(--shadow-sm)", marginBottom: "20px", maxWidth: "400px" }}>
            <FaSearch style={{ color: "var(--gray-400)" }} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", padding: "10px 0", fontSize: "0.9rem", width: "100%" }}
            />
          </div>

          {/* Stats Cards */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
            {[
              { label: "Total Users", value: users.length, color: "#3b82f6" },
              { label: "This Month", value: users.filter((u) => new Date(u.createdAt).getMonth() === new Date().getMonth()).length, color: "#10b981" },
            ].map((s) => (
              <div key={s.label} style={{ background: "white", borderRadius: "var(--radius-md)", padding: "16px 24px", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: s.color }}>
                  <FaUsers />
                </div>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700", fontFamily: "var(--font-display)", color: "var(--primary)" }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <Spinner />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "var(--gray-400)" }}>
                        <FaUserCircle style={{ fontSize: "2.5rem", marginBottom: "8px", display: "block", margin: "0 auto 8px", opacity: 0.3 }} />
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: "36px", height: "36px", borderRadius: "50%",
                              background: "linear-gradient(135deg, var(--primary), #0f3460)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "var(--accent)", fontWeight: "700", fontSize: "0.9rem", flexShrink: 0,
                            }}>
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600, color: "var(--gray-800)" }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--gray-600)" }}>{u.email}</td>
                        <td style={{ color: "var(--gray-600)" }}>{u.phone || "—"}</td>
                        <td style={{ color: "var(--gray-600)" }}>{formatDate(u.createdAt)}</td>
                        <td>
                          <span style={{
                            background: u.role === "admin" ? "#ede9fe" : "#dbeafe",
                            color: u.role === "admin" ? "#5b21b6" : "#1d4ed8",
                            padding: "3px 10px", borderRadius: "12px",
                            fontSize: "0.78rem", fontWeight: 600, textTransform: "capitalize",
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={deleting === u._id}
                            style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 600 }}
                          >
                            <FaTrash />
                            {deleting === u._id ? "Deleting…" : "Delete"}
                          </button>
                        </td>
                      </motion.tr>
                    ))
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

export default ManageUsers;
