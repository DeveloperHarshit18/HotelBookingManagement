import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

const HotelCard = ({ hotel }) => {
  const imageUrl = hotel.images?.[0]
    ? hotel.images[0].startsWith("http")
      ? hotel.images[0]
      : hotel.images[0]
    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80";

  return (
    <motion.div
      className="card"
      whileHover={{ y: -8, boxShadow: "0 16px 48px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img
          src={imageUrl}
          alt={hotel.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"; }}
        />
        {hotel.isFeatured && (
          <span style={{
            position: "absolute", top: "12px", left: "12px",
            background: "var(--accent)", color: "var(--primary)",
            padding: "4px 12px", borderRadius: "20px",
            fontSize: "0.75rem", fontWeight: "700",
          }}>FEATURED</span>
        )}
        <div style={{
          position: "absolute", bottom: "12px", right: "12px",
          background: "rgba(0,0,0,0.7)", color: "white",
          padding: "4px 10px", borderRadius: "8px",
          fontSize: "0.85rem", fontWeight: "600",
        }}>
          ₹{hotel.cheapestPrice?.toLocaleString()}/night
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "var(--primary)", fontWeight: "600" }}>
            {hotel.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--accent)" }}>
            <FaStar style={{ fontSize: "0.8rem" }} />
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--gray-800)" }}>{hotel.rating || "N/A"}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gray-400)", marginBottom: "12px" }}>
          <FaMapMarkerAlt style={{ fontSize: "0.8rem" }} />
          <span style={{ fontSize: "0.875rem" }}>{hotel.city}</span>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {hotel.description}
        </p>

        <Link
          to={`/hotels/${hotel._id}`}
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", display: "flex" }}
        >
          View Details <FaArrowRight />
        </Link>
      </div>
    </motion.div>
  );
};

export default HotelCard;
