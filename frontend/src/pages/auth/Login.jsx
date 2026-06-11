import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaHotel } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}! 🎉`);
      navigate(res.data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "white", borderRadius: "var(--radius-xl)",
          padding: "48px", width: "100%", maxWidth: "440px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), #0f3460)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px", fontSize: "1.6rem", color: "var(--accent)",
          }}>
            <FaHotel />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--primary)", fontSize: "1.7rem" }}>Welcome Back</h2>
          <p style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>Sign in to your LuxeStay account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope style={{ marginRight: "6px", color: "var(--accent)" }} />Email Address</label>
            <input
              type="email" value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com" required
            />
          </div>
          <div className="form-group">
            <label><FaLock style={{ marginRight: "6px", color: "var(--accent)" }} />Password</label>
            <input
              type="password" value={formData.password}
              onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••" required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", marginTop: "8px" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "var(--gray-600)", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: "600" }}>Sign Up</Link>
        </p>

        {/* Demo credentials hint */}
        <div style={{ marginTop: "20px", padding: "12px", background: "var(--gray-100)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--gray-600)" }}>
          <strong>Demo Admin:</strong> admin@hotel.com / admin123<br />
          <strong>Demo User:</strong> Register a new account
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
