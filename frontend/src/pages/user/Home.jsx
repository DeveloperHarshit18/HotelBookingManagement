import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch, FaMapMarkerAlt, FaStar, FaShieldAlt,
  FaConciergeBell, FaSwimmingPool, FaWifi,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HotelCard from "../../components/HotelCard";
import Spinner from "../../components/Spinner";
import { getFeaturedHotels } from "../../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedHotels()
      .then(res => setFeaturedHotels(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/hotels?search=${searchQuery}`);
  };

  return (
    <div>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
            style={{
              position: "absolute",
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              borderRadius: "50%",
              background: "rgba(201,168,76,0.08)",
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
          />
        ))}

        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{
              color: "var(--accent)", fontWeight: "600", letterSpacing: "3px",
              fontSize: "0.9rem", textTransform: "uppercase",
              display: "block", marginBottom: "16px",
            }}>
              ✦ Welcome to LuxeStay ✦
            </span>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "white", fontWeight: "700",
              lineHeight: 1.2, marginBottom: "20px",
            }}>
              Discover Your <br />
              <span style={{ color: "var(--accent)" }}>Perfect Stay</span>
            </h1>

            <p style={{
              fontSize: "1.1rem", color: "rgba(255,255,255,0.7)",
              maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.7,
            }}>
              Explore hundreds of luxury hotels, boutique stays, and hidden gems
              across India. Book in seconds, live in comfort.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <form onSubmit={handleSearch} style={{
              display: "flex", gap: "0",
              maxWidth: "560px", margin: "0 auto",
              background: "white", borderRadius: "50px",
              overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              padding: "6px",
            }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 16px", gap: "10px" }}>
                <FaMapMarkerAlt style={{ color: "var(--accent)" }} />
                <input
                  type="text"
                  placeholder="Search city or hotel..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    border: "none", outline: "none", width: "100%",
                    fontSize: "0.95rem", color: "var(--gray-800)",
                  }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ borderRadius: "40px", padding: "12px 28px" }}>
                <FaSearch /> Search
              </button>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ display: "flex", justifyContent: "center", gap: "48px", marginTop: "60px", flexWrap: "wrap" }}
          >
            {[["500+", "Hotels"], ["10K+", "Happy Guests"], ["50+", "Cities"], ["4.9★", "Rating"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--accent)", fontFamily: "var(--font-display)" }}>{num}</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)" }}
        >
          <div style={{ width: "26px", height: "42px", border: "2px solid rgba(255,255,255,0.3)", borderRadius: "13px", display: "flex", justifyContent: "center", paddingTop: "8px" }}>
            <div style={{ width: "4px", height: "8px", background: "var(--accent)", borderRadius: "2px" }} />
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="section" style={{ background: "white" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why Choose LuxeStay?</h2>
            <p className="section-subtitle">We go beyond just a room. We deliver an experience.</p>
          </motion.div>

          <div className="grid-4">
            {[
              { icon: <FaShieldAlt />, title: "Secure Booking", desc: "100% secure payment with instant confirmation" },
              { icon: <FaConciergeBell />, title: "24/7 Concierge", desc: "Round-the-clock support for all your needs" },
              { icon: <FaSwimmingPool />, title: "Premium Amenities", desc: "Pool, spa, gym and more at your fingertips" },
              { icon: <FaWifi />, title: "Free Wi-Fi", desc: "High-speed internet at every property" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: "32px 24px",
                  borderRadius: "var(--radius-md)",
                  border: "2px solid var(--gray-200)",
                  transition: "all 0.3s",
                  textAlign: "center",
                  cursor: "default",
                }}
                whileHover={{ borderColor: "var(--accent)", transform: "translateY(-4px)" }}
              >
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: "1.3rem", color: "var(--primary)",
                }}>
                  {item.icon}
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", color: "var(--primary)", marginBottom: "8px" }}>{item.title}</h4>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-400)", lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED HOTELS ===== */}
      <section className="section" style={{ background: "var(--off-white)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "48px" }}
          >
            <h2 className="section-title">Featured Hotels</h2>
            <p className="section-subtitle">Our most loved properties, handpicked for you</p>
          </motion.div>

          {loading ? (
            <Spinner />
          ) : featuredHotels.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--gray-400)" }}>
              <FaStar style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.3 }} />
              <p>No featured hotels yet. Add some from the admin panel.</p>
            </div>
          ) : (
            <div className="grid-3">
              {featuredHotels.map((hotel, i) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button className="btn-primary" onClick={() => navigate("/hotels")} style={{ fontSize: "1rem", padding: "14px 36px" }}>
              View All Hotels
            </button>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{
        background: "linear-gradient(135deg, var(--primary), #0f3460)",
        padding: "80px 0",
        textAlign: "center",
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2.2rem", marginBottom: "16px" }}>
              Ready for Your Next Adventure?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", marginBottom: "32px" }}>
              Join thousands of travelers who trust LuxeStay for their perfect getaway.
            </p>
            <button className="btn-primary" onClick={() => navigate("/register")} style={{ fontSize: "1.05rem", padding: "14px 40px" }}>
              Get Started — It's Free
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
