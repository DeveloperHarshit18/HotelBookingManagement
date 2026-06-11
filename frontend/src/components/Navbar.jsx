import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FaHotel, FaUser, FaSignOutAlt, FaBars, FaTimes,
  FaBookOpen, FaTachometerAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isHome = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "14px 0",
        background: scrolled || !isHome
          ? "rgba(26,26,46,0.98)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.4s ease",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaHotel style={{ color: "var(--accent)", fontSize: "1.5rem" }} />
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            fontWeight: "700",
            color: "white",
          }}>
            LuxeStay
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
          <NavLink to="/hotels">Hotels</NavLink>
          {user && <NavLink to="/my-bookings">My Bookings</NavLink>}
          {isAdmin && <NavLink to="/admin">Dashboard</NavLink>}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="desktop-nav">
          {user ? (
            <>
              <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "6px", color: "white", fontWeight: 500 }}>
                <FaUser style={{ color: "var(--accent)" }} /> {user.name?.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1.5px solid var(--accent)",
                  color: "var(--accent)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "white", fontWeight: 500 }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: "10px 20px" }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.4rem",
            cursor: "pointer",
            display: "none",
          }}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(26,26,46,0.99)",
              padding: "16px 20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <MobileLink to="/hotels" onClick={() => setMenuOpen(false)}>Hotels</MobileLink>
            {user && <MobileLink to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</MobileLink>}
            {isAdmin && <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</MobileLink>}
            {user ? (
              <>
                <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</MobileLink>
                <button onClick={handleLogout} style={{ color: "var(--accent)", background: "none", border: "none", fontSize: "1rem", cursor: "pointer", textAlign: "left", padding: "4px 0" }}>Logout</button>
              </>
            ) : (
              <>
                <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Login</MobileLink>
                <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Sign Up</MobileLink>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500, transition: "color 0.2s" }}
    onMouseEnter={e => e.target.style.color = "var(--accent)"}
    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.85)"}
  >{children}</Link>
);

const MobileLink = ({ to, children, onClick }) => (
  <Link to={to} onClick={onClick} style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", fontWeight: 500 }}>{children}</Link>
);

export default Navbar;
