import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaSlidersH } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HotelCard from "../../components/HotelCard";
import Spinner from "../../components/Spinner";
import { getHotels } from "../../services/api";

const Hotels = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (params = filters) => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "")
      );
      const res = await getHotels(cleanParams);
      setHotels(res.data);
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels(filters);
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    const reset = { search: "", city: "", minPrice: "", maxPrice: "", rating: "" };
    setFilters(reset);
    fetchHotels(reset);
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "80px", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "var(--primary)", padding: "48px 0 60px" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2.5rem", marginBottom: "12px" }}
            >
              Explore Hotels
            </motion.h1>
            <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "32px" }}>
              Find the perfect stay for every occasion
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: "600px", margin: "0 auto", gap: "10px" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "white", borderRadius: "10px", padding: "0 16px", gap: "10px" }}>
                <FaSearch style={{ color: "var(--accent)" }} />
                <input
                  type="text"
                  name="search"
                  placeholder="Search hotels or cities..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  style={{ border: "none", outline: "none", width: "100%", padding: "12px 0", fontSize: "0.95rem" }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ borderRadius: "10px" }}>Search</button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  background: showFilters ? "var(--accent)" : "rgba(255,255,255,0.15)",
                  border: "none", color: "white", padding: "12px 16px",
                  borderRadius: "10px", cursor: "pointer",
                }}
              >
                <FaSlidersH />
              </button>
            </form>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex", gap: "12px", marginTop: "16px",
                  flexWrap: "wrap", justifyContent: "center",
                }}
              >
                {[
                  { name: "city", placeholder: "City", type: "text" },
                  { name: "minPrice", placeholder: "Min Price (₹)", type: "number" },
                  { name: "maxPrice", placeholder: "Max Price (₹)", type: "number" },
                ].map(f => (
                  <input
                    key={f.name}
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    value={filters[f.name]}
                    onChange={handleFilterChange}
                    style={{
                      padding: "10px 14px", borderRadius: "8px", border: "none",
                      fontSize: "0.875rem", background: "rgba(255,255,255,0.15)",
                      color: "white", width: "160px",
                    }}
                  />
                ))}
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  style={{ padding: "10px 14px", borderRadius: "8px", border: "none", fontSize: "0.875rem", background: "rgba(255,255,255,0.15)", color: "white" }}
                >
                  <option value="">Any Rating</option>
                  {[4, 3, 2, 1].map(r => <option key={r} value={r}>{r}+ Stars</option>)}
                </select>
                <button className="btn-secondary" onClick={handleReset} style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>Reset</button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="container" style={{ padding: "48px 20px" }}>
          {loading ? (
            <Spinner />
          ) : hotels.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray-400)" }}>
              <FaSearch style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.3 }} />
              <h3 style={{ marginBottom: "8px", color: "var(--gray-600)" }}>No Hotels Found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          ) : (
            <>
              <p style={{ color: "var(--gray-400)", marginBottom: "24px", fontSize: "0.9rem" }}>
                Showing <strong>{hotels.length}</strong> hotel{hotels.length !== 1 ? "s" : ""}
              </p>
              <div className="grid-3">
                {hotels.map((hotel, i) => (
                  <motion.div
                    key={hotel._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <HotelCard hotel={hotel} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hotels;
