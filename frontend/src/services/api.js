import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
});


// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTH =====
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getUserProfile = () => API.get("/auth/profile");
export const updateUserProfile = (data) => API.put("/auth/profile", data);

// ===== HOTELS =====
export const getHotels = (params) => API.get("/hotels", { params });
export const getHotelById = (id) => API.get(`/hotels/${id}`);
export const getFeaturedHotels = () => API.get("/hotels/featured");
export const createHotel = (data) =>
  API.post("/hotels", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateHotel = (id, data) =>
  API.put(`/hotels/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteHotel = (id) => API.delete(`/hotels/${id}`);

// ===== ROOMS =====
export const getRoomsByHotel = (hotelId) => API.get(`/rooms/hotel/${hotelId}`);
export const getRoomById = (id) => API.get(`/rooms/${id}`);
export const getAllRooms = () => API.get("/rooms");
export const createRoom = (data) =>
  API.post("/rooms", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateRoom = (id, data) =>
  API.put(`/rooms/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

// ===== BOOKINGS =====
export const createBooking = (data) => API.post("/bookings", data);
export const getMyBookings = () => API.get("/bookings/my");
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const getAllBookings = () => API.get("/bookings");
export const updateBookingStatus = (id, status) =>
  API.put(`/bookings/${id}/status`, { status });

// ===== ADMIN =====
export const getDashboardStats = () => API.get("/admin/stats");
export const getAllUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);


export default API;