import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBookOpen } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookingCard from "../../components/BookingCard";
import Spinner from "../../components/Spinner";
import { getMyBookings, cancelBooking } from "../../services/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then(res => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--off-white)" }}>
        {/* Header */}
        <div style={{ background: "var(--primary)", padding: "48px 0" }}>
          <div className="container">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2rem", marginBottom: "8px" }}
            >
              My Bookings
            </motion.h1>
            <p style={{ color: "rgba(255,255,255,0.65)" }}>Track and manage all your hotel reservations</p>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 20px" }}>
          {loading ? (
            <Spinner />
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "80px 0", color: "var(--gray-400)" }}
            >
              <FaBookOpen style={{ fontSize: "4rem", marginBottom: "16px", opacity: 0.3 }} />
              <h3 style={{ color: "var(--gray-600)", marginBottom: "8px" }}>No Bookings Yet</h3>
              <p>Start exploring hotels and make your first booking!</p>
            </motion.div>
          ) : (
            bookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
