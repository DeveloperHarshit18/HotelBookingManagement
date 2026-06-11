import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User pages
import Home from "./pages/user/Home";
import Hotels from "./pages/user/Hotels";
import HotelDetail from "./pages/user/HotelDetail";
import BookRoom from "./pages/user/BookRoom";
import BookingConfirm from "./pages/user/BookingConfirm";
import MyBookings from "./pages/user/MyBookings";
import Profile from "./pages/user/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageHotels from "./pages/admin/ManageHotels";
import ManageRooms from "./pages/admin/ManageRooms";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "10px",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "white" },
            },
          }}
        />

        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"        element={<Home />} />
          <Route path="/hotels"  element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected User Routes ── */}
          <Route
            path="/book/:roomId"
            element={<ProtectedRoute><BookRoom /></ProtectedRoute>}
          />
          <Route
            path="/booking-confirm/:id"
            element={<ProtectedRoute><BookingConfirm /></ProtectedRoute>}
          />
          <Route
            path="/my-bookings"
            element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />

          {/* ── Admin Routes ── */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/hotels"
            element={<AdminRoute><ManageHotels /></AdminRoute>}
          />
          <Route
            path="/admin/rooms"
            element={<AdminRoute><ManageRooms /></AdminRoute>}
          />
          <Route
            path="/admin/bookings"
            element={<AdminRoute><ManageBookings /></AdminRoute>}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute><ManageUsers /></AdminRoute>}
          />

          {/* ── 404 Fallback ── */}
          <Route
            path="*"
            element={
              <div style={{
                minHeight: "100vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", color: "var(--primary)",
              }}>
                <div style={{ fontSize: "6rem", fontWeight: "700", color: "var(--accent)" }}>404</div>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "12px" }}>Page Not Found</h2>
                <p style={{ color: "var(--gray-400)", marginBottom: "24px" }}>
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
