import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool,
  FaCar, FaUtensils, FaBed, FaUsers, FaArrowLeft,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { getHotelById, getRoomsByHotel } from "../../services/api";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    Promise.all([getHotelById(id), getRoomsByHotel(id)])
      .then(([hRes, rRes]) => {
        setHotel(hRes.data);
        setRooms(rRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><Spinner /></>;
  if (!hotel) return <><Navbar /><div style={{ padding: "120px 20px", textAlign: "center" }}>Hotel not found.</div></>;

  const images = hotel.images?.length > 0
    ? hotel.images
    : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"];

  const amenityIcons = { WiFi: <FaWifi />, Pool: <FaSwimmingPool />, Parking: <FaCar />, Restaurant: <FaUtensils /> };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>

        {/* Back Button */}
        <div className="container" style={{ padding: "20px 20px 0" }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: "var(--gray-600)", fontWeight: 500 }}>
            <FaArrowLeft /> Back to Hotels
          </button>
        </div>

        <div className="container" style={{ padding: "20px" }}>
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "32px" }}
          >
            <div style={{ position: "relative", height: "420px" }}>
              <img
                src={images[activeImage]}
                alt={hotel.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"; }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "8px", padding: "8px", background: "white" }}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: "80px", height: "60px", objectFit: "cover",
                      borderRadius: "8px", cursor: "pointer",
                      opacity: activeImage === i ? 1 : 0.6,
                      border: activeImage === i ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"; }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px" }}>
            {/* Left Column */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "12px" }}>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--primary)" }}>{hotel.name}</h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--primary)", color: "white", padding: "8px 16px", borderRadius: "10px" }}>
                    <FaStar style={{ color: "var(--accent)" }} />
                    <span style={{ fontWeight: "700" }}>{hotel.rating || "N/A"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gray-400)", marginBottom: "20px" }}>
                  <FaMapMarkerAlt style={{ color: "var(--accent)" }} />
                  <span>{hotel.address}, {hotel.city}</span>
                </div>

                <p style={{ color: "var(--gray-600)", lineHeight: 1.8, marginBottom: "28px" }}>{hotel.description}</p>

                {hotel.amenities?.length > 0 && (
                  <div style={{ marginBottom: "28px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "14px", color: "var(--primary)" }}>Amenities</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {hotel.amenities.map((a, i) => (
                        <span key={i} style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "8px 16px", background: "var(--gray-100)",
                          borderRadius: "20px", fontSize: "0.875rem", fontWeight: 500,
                        }}>
                          {amenityIcons[a] || "✓"} {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Rooms Section */}
              <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "20px", color: "var(--primary)" }}>
                Available Rooms ({rooms.length})
              </h2>
              {rooms.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--gray-400)", background: "var(--gray-100)", borderRadius: "12px" }}>
                  No rooms available at the moment.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {rooms.map((room, i) => (
                    <motion.div
                      key={room._id}
                      className="card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ padding: "20px" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                            <FaBed style={{ color: "var(--accent)" }} />
                            <h4 style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{room.title}</h4>
                            <span style={{
                              background: "var(--gray-100)", padding: "2px 10px",
                              borderRadius: "10px", fontSize: "0.75rem", fontWeight: "600",
                            }}>{room.roomType}</span>
                          </div>
                          <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", marginBottom: "8px" }}>{room.description}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "0.85rem", color: "var(--gray-400)" }}>
                            <span><FaUsers style={{ marginRight: "4px" }} />Up to {room.maxOccupancy} guests</span>
                            <span>Room #{room.roomNumber}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                            ₹{room.price?.toLocaleString()}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--gray-400)", marginBottom: "12px" }}>per night</div>
                          <button
                            className="btn-primary"
                            disabled={!room.isAvailable}
                            onClick={() => navigate(`/book/${room._id}?hotelId=${hotel._id}`)}
                            style={{ opacity: room.isAvailable ? 1 : 0.5, cursor: room.isAvailable ? "pointer" : "not-allowed" }}
                          >
                            {room.isAvailable ? "Book Now" : "Unavailable"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: "white", borderRadius: "var(--radius-md)",
                  padding: "24px", boxShadow: "var(--shadow-md)",
                  position: "sticky", top: "100px",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>Starting from</div>
                  <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                    ₹{hotel.cheapestPrice?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>per night</div>
                </div>

                <div style={{ borderTop: "1px solid var(--gray-200)", paddingTop: "16px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--gray-600)" }}>Rating</span>
                    <span style={{ fontWeight: "600" }}>⭐ {hotel.rating}/5</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--gray-600)" }}>Available Rooms</span>
                    <span style={{ fontWeight: "600" }}>{rooms.filter(r => r.isAvailable).length}</span>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "14px" }}
                  onClick={() => document.querySelector(".rooms-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Choose a Room
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HotelDetail;
