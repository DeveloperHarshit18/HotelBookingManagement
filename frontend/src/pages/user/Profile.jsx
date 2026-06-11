import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaSave } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../services/api";

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setSaving(true);
    try {
      const updates = { name: formData.name, email: formData.email, phone: formData.phone };
      if (formData.password) updates.password = formData.password;
      const res = await updateUserProfile(updates);
      login(res.data);
      toast.success("Profile updated successfully!");
      setFormData(p => ({ ...p, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--off-white)" }}>
        <div style={{ background: "var(--primary)", padding: "48px 0" }}>
          <div className="container">
            <h1 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2rem" }}>My Profile</h1>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 20px", maxWidth: "640px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: "white", borderRadius: "var(--radius-md)", padding: "32px", boxShadow: "var(--shadow-sm)" }}
          >
            {/* Avatar */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), #0f3460)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", fontSize: "2rem", color: "var(--accent)",
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{user?.name}</h3>
              <span style={{ fontSize: "0.85rem", color: "var(--gray-400)", background: "var(--gray-100)", padding: "4px 12px", borderRadius: "20px" }}>
                {user?.role}
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><FaUser style={{ marginRight: "6px", color: "var(--accent)" }} />Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><FaEnvelope style={{ marginRight: "6px", color: "var(--accent)" }} />Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><FaPhone style={{ marginRight: "6px", color: "var(--accent)" }} />Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXXXXXXX" />
              </div>

              <div style={{ borderTop: "1px solid var(--gray-200)", paddingTop: "20px", marginBottom: "4px" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--gray-400)", marginBottom: "14px" }}>Leave password fields blank to keep current password</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="New password" />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={saving}>
                <FaSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
