# 🏨 LuxeStay — Hotel Booking Management System

A full-stack **MERN** Hotel Booking Management System with a beautiful modern UI, smooth animations, JWT authentication, admin dashboard with charts, and complete booking flow.

> Built with: **MongoDB · Express.js · React.js · Node.js**

---

## 📸 Features

### 👤 User Side
- Register & Login with JWT authentication
- Browse & search hotels by city, price, rating
- View hotel details with image gallery
- View available rooms per hotel
- Book a room with check-in / check-out dates
- Booking confirmation page
- My Bookings page with cancel option
- User profile update

### 🔧 Admin Side
- Secure admin login
- Dashboard with stats (users, hotels, bookings, revenue)
- Bar chart for monthly bookings & Pie chart for booking status
- Add / Edit / Delete Hotels
- Add / Edit / Delete Rooms
- View all bookings — Confirm / Reject / Cancel
- View & delete users

### 🎨 UI/UX
- Fully responsive (mobile, tablet, desktop)
- Framer Motion animations (hero, cards, page transitions)
- Toast notifications (react-hot-toast)
- Loading spinners
- Clean sticky navbar with scroll effect
- Modern admin sidebar with active link highlight
- Gold & navy luxury colour palette

---

## 🗂️ Folder Structure

```
hotel-booking-system/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   ├── hotelController.js
│   │   ├── roomController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── adminMiddleware.js    # Admin-only guard
│   │   └── errorMiddleware.js   # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Hotel.js
│   │   ├── Room.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hotelRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                  # Multer image storage
│   ├── utils/generateToken.js
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── components/           # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── AdminSidebar.jsx
│       │   ├── HotelCard.jsx
│       │   ├── BookingCard.jsx
│       │   ├── Spinner.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── AdminRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state
│       ├── pages/
│       │   ├── auth/Login.jsx · Register.jsx
│       │   ├── user/Home · Hotels · HotelDetail · BookRoom · BookingConfirm · MyBookings · Profile
│       │   └── admin/AdminDashboard · ManageHotels · ManageRooms · ManageBookings · ManageUsers
│       ├── services/api.js       # All Axios API calls
│       ├── App.jsx               # Routes
│       └── index.css             # Global styles + design tokens
│
├── seed.js                       # Sample data seeder
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### Step 1 — Clone & Install

```bash
# Clone the project
git clone <your-repo-url>
cd hotel-booking-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure Environment Variables

**Backend** — create `backend/.env` (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hotel_booking
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

**Frontend** — create `frontend/.env` (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3 — Seed the Database (Optional but Recommended)

```bash
# From the root hotel-booking-system/ folder
node seed.js
```

This creates:
- ✅ Admin account: `admin@hotel.com` / `admin123`
- ✅ 3 user accounts: `rahul@email.com` / `user1234`
- ✅ 6 hotels across India
- ✅ 15 rooms
- ✅ 3 sample bookings

---

### Step 4 — Run the Application

**Terminal 1 — Start Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm run dev
# App opens on http://localhost:5173
```

---

### Step 5 — Open in Browser

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | User homepage |
| `http://localhost:5173/login` | Login page |
| `http://localhost:5173/admin` | Admin dashboard |

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get token |
| GET | `/api/auth/profile` | Private | Get user profile |
| PUT | `/api/auth/profile` | Private | Update profile |

### Hotels
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/hotels` | Public | Get all hotels (with filters) |
| GET | `/api/hotels/featured` | Public | Get featured hotels |
| GET | `/api/hotels/:id` | Public | Get single hotel |
| POST | `/api/hotels` | Admin | Create hotel |
| PUT | `/api/hotels/:id` | Admin | Update hotel |
| DELETE | `/api/hotels/:id` | Admin | Delete hotel |

### Rooms
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/rooms/hotel/:hotelId` | Public | Get rooms for a hotel |
| GET | `/api/rooms/:id` | Public | Get single room |
| GET | `/api/rooms` | Admin | Get all rooms |
| POST | `/api/rooms` | Admin | Create room |
| PUT | `/api/rooms/:id` | Admin | Update room |
| DELETE | `/api/rooms/:id` | Admin | Delete room |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | Private | Create booking |
| GET | `/api/bookings/my` | Private | My bookings |
| GET | `/api/bookings/:id` | Private | Get booking |
| PUT | `/api/bookings/:id/cancel` | Private | Cancel booking |
| GET | `/api/bookings` | Admin | All bookings |
| PUT | `/api/bookings/:id/status` | Admin | Update booking status |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/users` | Admin | All users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |

---

## 🛡️ Security Features
- Passwords hashed with **bcryptjs** (salt rounds: 10)
- **JWT** tokens with 30-day expiry
- Protected routes (user & admin level)
- Input validation on all models
- Multer for safe file uploads
- CORS enabled

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Charts | Recharts |
| Icons | React Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Dev Server | Vite |

---

## 👨‍💻 Ideal For
- College final year project
- Resume portfolio project
- MERN stack learning reference
- Full-stack job interview preparation

---

## 📄 License
MIT — Free to use, modify and distribute.

---

*Built with ❤️ using the MERN Stack*
