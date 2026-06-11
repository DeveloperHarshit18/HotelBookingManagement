import { motion } from "framer-motion";
import { FaHotel, FaBed, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";

const BookingCard = ({ booking, onCancel }) => {
  const checkIn = new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const checkOut = new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const statusColors = {
    pending: { bg: "#fef3c7", color: "#92400e" },
    confirmed: { bg: "#d1fae5", color: "#065f46" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" },
    rejected: { bg: "#f3f4f6", color: "#374151" },
  };
  const sc = statusColors[booking.status] || statusColors.pending;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "20px", marginBottom: "16px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        {/* Hotel Info */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden",
            flexShrink: 0, background: "var(--gray-200)",
          }}>
            <img
              src={booking.hotel?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"}
              alt={booking.hotel?.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"; }}
            />
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--primary)", marginBottom: "4px" }}>
              {booking.hotel?.name}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>
              {booking.hotel?.city} · {booking.room?.roomType} Room
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span style={{
          background: sc.bg, color: sc.color,
          padding: "6px 14px", borderRadius: "20px",
          fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase",
        }}>{booking.status}</span>
      </div>

      {/* Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", margin: "16px 0", padding: "16px", background: "var(--gray-100)", borderRadius: "10px" }}>
        <InfoItem icon={<FaCalendarAlt />} label="Check In" value={checkIn} />
        <InfoItem icon={<FaCalendarAlt />} label="Check Out" value={checkOut} />
        <InfoItem icon={<FaBed />} label="Guests" value={`${booking.guests} Guest(s)`} />
        <InfoItem icon={<FaRupeeSign />} label="Total" value={`₹${booking.totalPrice?.toLocaleString()}`} />
      </div>

      {/* Actions */}
      {booking.status === "pending" && onCancel && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-danger" onClick={() => onCancel(booking._id)}>
            Cancel Booking
          </button>
        </div>
      )}
    </motion.div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gray-400)", fontSize: "0.78rem", marginBottom: "3px" }}>
      {icon} {label}
    </div>
    <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--gray-800)" }}>{value}</span>
  </div>
);

export default BookingCard;
