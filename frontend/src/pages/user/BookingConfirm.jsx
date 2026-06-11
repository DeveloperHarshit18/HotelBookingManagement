import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHotel, FaBed, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { getBookingById } from "../../services/api";

const BookingConfirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingById(id)
      .then(res => setBooking(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><Spinner /></>;

  const checkIn = booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";
  const checkOut = booking?.checkOut ? new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--off-white)", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: "600px", width: "100%", background: "white", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xl)" }}
        >
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, var(--primary), #0f3460)", padding: "48px 32px", textAlign: "center" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <FaCheckCircle style={{ fontSize: "4rem", color: "var(--accent)", marginBottom: "16px" }} />
            </motion.div>
            <h1 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.8rem", marginBottom: "8px" }}>Booking Confirmed!</h1>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>Your booking is pending admin approval</p>
          </div>

          {/* Details */}
          <div style={{ padding: "32px" }}>
            <div style={{ background: "var(--off-white)", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--primary)", marginBottom: "16px" }}>Booking Summary</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <ConfirmRow icon={<FaHotel />} label="Hotel" value={booking?.hotel?.name} />
                <ConfirmRow icon={<FaBed />} label="Room" value={`${booking?.room?.title} (${booking?.room?.roomType})`} />
                <ConfirmRow icon={<FaCalendarAlt />} label="Check-In" value={checkIn} />
                <ConfirmRow icon={<FaCalendarAlt />} label="Check-Out" value={checkOut} />
                <ConfirmRow icon={<FaRupeeSign />} label="Total Price" value={`₹${booking?.totalPrice?.toLocaleString()}`} isHighlight />
              </div>
            </div>

            {/* Booking ID */}
            <div style={{ textAlign: "center", padding: "12px", background: "var(--gray-100)", borderRadius: "8px", marginBottom: "24px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>Booking ID: </span>
              <code style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "600" }}>{booking?._id}</code>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button className="btn-secondary" onClick={() => navigate("/my-bookings")}>View My Bookings</button>
              <button className="btn-primary" onClick={() => navigate("/hotels")}>Book Another Room</button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

const ConfirmRow = ({ icon, label, value, isHighlight }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--gray-200)" }}>
    <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gray-600)", fontSize: "0.9rem" }}>
      <span style={{ color: "var(--accent)" }}>{icon}</span> {label}
    </span>
    <span style={{ fontWeight: isHighlight ? "700" : "600", color: isHighlight ? "var(--primary)" : "var(--gray-800)", fontSize: isHighlight ? "1.1rem" : "0.9rem" }}>
      {value}
    </span>
  </div>
);

export default BookingConfirm;
