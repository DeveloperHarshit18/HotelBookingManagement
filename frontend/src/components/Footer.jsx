import { Link } from "react-router-dom";
import { FaHotel, FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => (
  <footer style={{
    background: "var(--primary)",
    color: "rgba(255,255,255,0.75)",
    padding: "60px 0 24px",
  }}>
    <div className="container">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <FaHotel style={{ color: "var(--accent)", fontSize: "1.4rem" }} />
            <span style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.3rem", fontWeight: "700" }}>LuxeStay</span>
          </div>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
            Experience luxury and comfort at its finest. Your perfect stay awaits.
          </p>
          <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
            {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
              <a key={i} href="#" style={{ color: "var(--accent)", fontSize: "1.2rem" }}><Icon /></a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "white", marginBottom: "16px", fontFamily: "var(--font-display)" }}>Quick Links</h4>
          {[["Home", "/"], ["Hotels", "/hotels"], ["My Bookings", "/my-bookings"], ["Profile", "/profile"]].map(([label, path]) => (
            <div key={label} style={{ marginBottom: "8px" }}>
              <Link to={path} style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
              >{label}</Link>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "white", marginBottom: "16px", fontFamily: "var(--font-display)" }}>Contact</h4>
          {[
            [FaMapMarkerAlt, "123 Luxury Ave, New Delhi"],
            [FaPhone, "+91 9876543210"],
            [FaEnvelope, "info@luxestay.com"],
          ].map(([Icon, text], i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
              <Icon style={{ color: "var(--accent)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.9rem" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", textAlign: "center", fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} LuxeStay Hotel Management. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
