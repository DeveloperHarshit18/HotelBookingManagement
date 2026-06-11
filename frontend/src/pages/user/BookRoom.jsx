import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaBed, FaCalendarAlt, FaUsers, FaRupeeSign, FaArrowLeft } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { getRoomById, getHotelById, createBooking } from "../../services/api";

const BookRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hotelId = searchParams.get("hotelId");

  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    checkIn: today,
    checkOut: "",
    guests: 1,
    specialRequests: "",
  });

  useEffect(() => {
    Promise.all([getRoomById(roomId), getHotelById(hotelId)])
      .then(([rRes, hRes]) => {
        setRoom(rRes.data);
        setHotel(hRes.data);
      })
      .catch(() => toast.error("Failed to load room details"))
      .finally(() => setLoading(false));
  }, [roomId, hotelId]);

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const diff = new Date(formData.checkOut) - new Date(formData.checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const totalPrice = nights * (room?.price || 0);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights < 1) return toast.error("Check-out must be after check-in");
    setSubmitting(true);
    try {
      const res = await createBooking({ hotel: hotelId, room: roomId, ...formData, guests: Number(formData.guests) });
      toast.success("Booking successful! 🎉");
      navigate(`/booking-confirm/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--off-white)" }}>
        <div className="container" style={{ padding: "40px 20px" }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: "var(--gray-600)", marginBottom: "24px", fontWeight: 500 }}>
            <FaArrowLeft /> Back
          </button>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--primary)", marginBottom: "32px" }}
          >
            Book Your Room
          </motion.h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px" }}>
            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ background: "white", borderRadius: "var(--radius-md)", padding: "32px", boxShadow: "var(--shadow-sm)" }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "24px", color: "var(--primary)" }}>Your Details</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label><FaCalendarAlt style={{ marginRight: "6px", color: "var(--accent)" }} />Check-In Date</label>
                    <input type="date" name="checkIn" value={formData.checkIn} min={today} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label><FaCalendarAlt style={{ marginRight: "6px", color: "var(--accent)" }} />Check-Out Date</label>
                    <input type="date" name="checkOut" value={formData.checkOut} min={formData.checkIn || today} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label><FaUsers style={{ marginRight: "6px", color: "var(--accent)" }} />Number of Guests</label>
                  <select name="guests" value={formData.guests} onChange={handleChange}>
                    {[...Array(room?.maxOccupancy || 4)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3} placeholder="Any special requests or notes..." />
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ background: "var(--off-white)", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "var(--gray-600)" }}>
                      <span>₹{room?.price?.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                      <span>₹{(room?.price * nights)?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "var(--primary)", fontSize: "1.1rem", borderTop: "1px solid var(--gray-200)", paddingTop: "8px" }}>
                      <span>Total</span>
                      <span>₹{totalPrice?.toLocaleString()}</span>
                    </div>
                  </motion.div>
                )}

                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem" }} disabled={submitting}>
                  {submitting ? "Confirming Booking..." : "Confirm Booking"}
                </button>
              </form>
            </motion.div>

            {/* Room Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ position: "sticky", top: "100px", alignSelf: "start" }}
            >
              <div className="card" style={{ overflow: "hidden" }}>
                <img
                  src={room?.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80"}
                  alt={room?.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80"; }}
                />
                <div style={{ padding: "20px" }}>
                  <h4 style={{ fontFamily: "var(--font-display)", color: "var(--primary)", marginBottom: "6px" }}>{room?.title}</h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--gray-400)", marginBottom: "14px" }}>{hotel?.name} · {hotel?.city}</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Detail icon={<FaBed />} label="Room Type" value={room?.roomType} />
                    <Detail icon={<FaUsers />} label="Max Occupancy" value={`${room?.maxOccupancy} guests`} />
                    <Detail icon={<FaRupeeSign />} label="Price per night" value={`₹${room?.price?.toLocaleString()}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

const Detail = ({ icon, label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gray-400)" }}>{icon} {label}</span>
    <span style={{ fontWeight: "600", color: "var(--gray-800)" }}>{value}</span>
  </div>
);

export default BookRoom;
