import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaHotel, FaTimes } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";
import { getHotels, createHotel, updateHotel, deleteHotel } from "../../services/api";

const EMPTY_FORM = {
  name: "", city: "", address: "", description: "",
  cheapestPrice: "", rating: "", amenities: "", isFeatured: false,
};

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchHotels(); }, []);

  const fetchHotels = () => {
    setLoading(true);
    getHotels()
      .then((r) => setHotels(r.data))
      .catch(() => toast.error("Failed to load hotels"))
      .finally(() => setLoading(false));
  };

  const openAdd = () => { setEditHotel(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (h) => {
    setEditHotel(h);
    setForm({
      name: h.name, city: h.city, address: h.address,
      description: h.description, cheapestPrice: h.cheapestPrice,
      rating: h.rating, amenities: h.amenities?.join(", ") || "",
      isFeatured: h.isFeatured,
    });
    setShowModal(true);
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
        if (k === "amenities") fd.append(k, JSON.stringify(v.split(",").map((s) => s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });

      if (editHotel) {
        await updateHotel(editHotel._id, fd);
        toast.success("Hotel updated!");
      } else {
        await createHotel(fd);
        toast.success("Hotel added!");
      }
      setShowModal(false);
      fetchHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel? This cannot be undone.")) return;
    try {
      await deleteHotel(id);
      toast.success("Hotel deleted");
      setHotels((p) => p.filter((h) => h._id !== id));
    } catch {
      toast.error("Failed to delete hotel");
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
                Manage Hotels
              </h1>
              <p style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>{hotels.length} hotels in total</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <FaPlus /> Add Hotel
            </button>
          </div>

          {loading ? <Spinner /> : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Hotel</th><th>City</th><th>Price/Night</th><th>Rating</th><th>Featured</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>
                      No hotels yet. Click "Add Hotel" to get started.
                    </td></tr>
                  ) : hotels.map((h) => (
                    <tr key={h._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", background: "var(--gray-200)", flexShrink: 0 }}>
                            <img
                              src={h.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&q=60"}
                              alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&q=60"; }}
                            />
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--gray-800)" }}>{h.name}</span>
                        </div>
                      </td>
                      <td>{h.city}</td>
                      <td style={{ fontWeight: 600 }}>₹{h.cheapestPrice?.toLocaleString()}</td>
                      <td>⭐ {h.rating}</td>
                      <td>
                        <span style={{
                          background: h.isFeatured ? "#d1fae5" : "#f3f4f6",
                          color: h.isFeatured ? "#065f46" : "#374151",
                          padding: "3px 10px", borderRadius: "12px", fontSize: "0.78rem", fontWeight: 600,
                        }}>
                          {h.isFeatured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => openEdit(h)}
                            style={{ background: "#dbeafe", color: "#1d4ed8", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 600 }}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(h._id)}
                            style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 600 }}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: "white", borderRadius: "var(--radius-lg)", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {editHotel ? "Edit Hotel" : "Add New Hotel"}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--gray-400)" }}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {[
                  { name: "name",          label: "Hotel Name",      type: "text",   placeholder: "Grand Luxury Hotel" },
                  { name: "city",          label: "City",            type: "text",   placeholder: "Mumbai" },
                  { name: "address",       label: "Full Address",    type: "text",   placeholder: "123 Marine Drive" },
                  { name: "cheapestPrice", label: "Starting Price (₹)", type: "number", placeholder: "2000" },
                  { name: "rating",        label: "Rating (0-5)",    type: "number", placeholder: "4.5" },
                  { name: "amenities",     label: "Amenities (comma-separated)", type: "text", placeholder: "WiFi, Pool, Gym, Spa" },
                ].map((f) => (
                  <div className="form-group" key={f.name}>
                    <label>{f.label}</label>
                    <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} required={["name","city","address","cheapestPrice"].includes(f.name)} step={f.name === "rating" ? "0.1" : undefined} min={f.name === "rating" ? "0" : undefined} max={f.name === "rating" ? "5" : undefined} />
                  </div>
                ))}

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the hotel..." required />
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} id="featured" style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                  <label htmlFor="featured" style={{ marginBottom: 0, cursor: "pointer" }}>Mark as Featured Hotel</label>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
                    {saving ? "Saving..." : editHotel ? "Update Hotel" : "Add Hotel"}
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

export default ManageHotels;
