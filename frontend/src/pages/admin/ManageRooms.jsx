import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBed } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";
import {
  getAllRooms, createRoom, updateRoom, deleteRoom, getHotels,
} from "../../services/api";

const ROOM_TYPES = ["Single", "Double", "Suite", "Deluxe", "Family"];

const EMPTY = {
  hotel: "", title: "", description: "", roomType: "Single",
  price: "", maxOccupancy: 2, roomNumber: "", amenities: "", isAvailable: true,
};

const ManageRooms = () => {
  const [rooms,   setRooms]   = useState([]);
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    Promise.all([getAllRooms(), getHotels()])
      .then(([rr, hr]) => { setRooms(rr.data); setHotels(hr.data); })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () =>
    getAllRooms().then((r) => setRooms(r.data)).catch(() => {});

  const openAdd = () => { setEditRoom(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r) => {
    setEditRoom(r);
    setForm({
      hotel: r.hotel?._id || r.hotel,
      title: r.title, description: r.description,
      roomType: r.roomType, price: r.price,
      maxOccupancy: r.maxOccupancy, roomNumber: r.roomNumber,
      amenities: r.amenities?.join(", ") || "",
      isAvailable: r.isAvailable,
    });
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "amenities")
          fd.append(k, JSON.stringify(v.split(",").map((s) => s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (editRoom) {
        await updateRoom(editRoom._id, fd);
        toast.success("Room updated!");
      } else {
        await createRoom(fd);
        toast.success("Room added!");
      }
      setModal(false);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await deleteRoom(id);
      toast.success("Room deleted");
      setRooms((p) => p.filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--primary)" }}>
                Manage Rooms
              </h1>
              <p style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>
                {rooms.length} rooms across all hotels
              </p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <FaPlus /> Add Room
            </button>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Hotel</th>
                    <th>Type</th>
                    <th>Room #</th>
                    <th>Price/Night</th>
                    <th>Occupancy</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>
                        No rooms yet. Click "Add Room" to start.
                      </td>
                    </tr>
                  ) : (
                    rooms.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg,var(--primary),#0f3460)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <FaBed style={{ color: "var(--accent)", fontSize: "0.9rem" }} />
                            </div>
                            <span style={{ fontWeight: 600, color: "var(--gray-800)" }}>{r.title}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--gray-600)" }}>{r.hotel?.name || "—"}</td>
                        <td>
                          <span style={{ background: "var(--gray-100)", padding: "3px 10px", borderRadius: "10px", fontSize: "0.78rem", fontWeight: 600 }}>
                            {r.roomType}
                          </span>
                        </td>
                        <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{r.roomNumber}</td>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{r.price?.toLocaleString()}</td>
                        <td>{r.maxOccupancy} guests</td>
                        <td>
                          <span style={{
                            background: r.isAvailable ? "#d1fae5" : "#fee2e2",
                            color: r.isAvailable ? "#065f46" : "#991b1b",
                            padding: "3px 10px", borderRadius: "12px", fontSize: "0.78rem", fontWeight: 600,
                          }}>
                            {r.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => openEdit(r)}
                              style={{ background: "#dbeafe", color: "#1d4ed8", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 600 }}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(r._id)}
                              style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 600 }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: "white", borderRadius: "var(--radius-lg)", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {editRoom ? "Edit Room" : "Add New Room"}
                </h2>
                <button onClick={() => setModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--gray-400)" }}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Hotel *</label>
                  <select name="hotel" value={form.hotel} onChange={handleChange} required>
                    <option value="">-- Choose a Hotel --</option>
                    {hotels.map((h) => (
                      <option key={h._id} value={h._id}>{h.name} — {h.city}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Room Title *</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Deluxe King Room" required />
                  </div>
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input type="text" name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="101" required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Room Type *</label>
                    <select name="roomType" value={form.roomType} onChange={handleChange} required>
                      {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price per Night (₹) *</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="2500" min="1" required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Max Occupancy *</label>
                    <input type="number" name="maxOccupancy" value={form.maxOccupancy} onChange={handleChange} min="1" max="20" required />
                  </div>
                  <div className="form-group">
                    <label>Amenities (comma-separated)</label>
                    <input type="text" name="amenities" value={form.amenities} onChange={handleChange} placeholder="AC, TV, Mini Bar" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the room..." required />
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="checkbox" name="isAvailable" id="avail" checked={form.isAvailable} onChange={handleChange} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                  <label htmlFor="avail" style={{ marginBottom: 0, cursor: "pointer" }}>Room is Available for Booking</label>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button type="button" className="btn-secondary" onClick={() => setModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
                    {saving ? "Saving..." : editRoom ? "Update Room" : "Add Room"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageRooms;
