/**
 * SEED SCRIPT — Run this once to populate the database with sample data.
 * Usage:  node backend/seed.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
mongoose.set("bufferCommands", false);

dotenv.config({ path: "./backend/.env" });

const User = require("./backend/models/User");
const Hotel = require("./backend/models/Hotel");
const Room = require("./backend/models/Room");
const Booking = require("./backend/models/Booking");

const seed = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    await mongoose.connection.asPromise();

    // Wait for connection to be fully ready
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("✅ Connected to MongoDB");
    console.log("DB Name:", mongoose.connection.name);
    console.log("Ready State:", mongoose.connection.readyState);

    // Drop collections wala pura block hatao

    console.log("DB Name:", mongoose.connection.name);
    console.log("Ready State:", mongoose.connection.readyState);


const db = mongoose.connection.db;

await db.collection("users").deleteMany({});
await db.collection("hotels").deleteMany({});
await db.collection("rooms").deleteMany({});
await db.collection("bookings").deleteMany({});

console.log("🗑️  Cleared existing data");

const salt = await bcrypt.genSalt(10);
const hashedAdminPassword = await bcrypt.hash("admin123", salt);
const hashedUserPassword = await bcrypt.hash("user1234", salt);

await db.collection("users").insertOne({
  name: "Admin User",
  email: "admin@hotel.com",
  password: hashedAdminPassword,
  phone: "+91 9876543210",
  role: "admin",
  profileImage: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const userResult = await db.collection("users").insertMany([
  {
    name: "Rahul Sharma",
    email: "rahul@email.com",
    password: hashedUserPassword,
    phone: "+91 9811223344",
    role: "user",
    profileImage: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Priya Singh",
    email: "priya@email.com",
    password: hashedUserPassword,
    phone: "+91 9822334455",
    role: "user",
    profileImage: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Arjun Mehta",
    email: "arjun@email.com",
    password: hashedUserPassword,
    phone: "+91 9833445566",
    role: "user",
    profileImage: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

const users = Object.values(userResult.insertedIds).map((_id) => ({ _id }));

console.log("👤 Created admin + 3 users");

    // ── Create Hotels ──
    const hotelResult = await db.collection("hotels").insertMany([
      {
        name: "The Grand Palace",
        city: "Mumbai",
        address: "Marine Drive, Nariman Point, Mumbai 400021",
        description:
          "A landmark of luxury overlooking the Arabian Sea. The Grand Palace offers world-class amenities, Michelin-star dining, and unparalleled service in the heart of Mumbai.",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        ],
        rating: 4.8,
        cheapestPrice: 8500,
        amenities: [
          "WiFi",
          "Pool",
          "Spa",
          "Gym",
          "Restaurant",
          "Parking",
          "Bar",
          "Concierge",
        ],
        isFeatured: true,
      },
      {
        name: "Royal Heritage Resort",
        city: "Jaipur",
        address: "Civil Lines, Near Rambagh, Jaipur 302006",
        description:
          "Experience the splendour of Rajputana royalty. Set in a restored 19th-century palace, this resort blends regal architecture with modern luxury.",
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
        ],
        rating: 4.7,
        cheapestPrice: 6200,
        amenities: [
          "WiFi",
          "Pool",
          "Spa",
          "Restaurant",
          "Horse Riding",
          "Cultural Shows",
        ],
        isFeatured: true,
      },
      {
        name: "Serene Backwaters Hotel",
        city: "Kochi",
        address: "Fort Kochi, Marine Drive, Kochi 682001",
        description:
          "Nestled on the tranquil backwaters of Kerala, this eco-luxury resort offers houseboat experiences, Ayurvedic spa treatments, and breathtaking sunset views.",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        ],
        rating: 4.6,
        cheapestPrice: 4800,
        amenities: [
          "WiFi",
          "Pool",
          "Ayurvedic Spa",
          "Restaurant",
          "Boating",
          "Yoga",
        ],
        isFeatured: true,
      },
      {
        name: "Delhi Business Suites",
        city: "Delhi",
        address: "Connaught Place, New Delhi 110001",
        description:
          "Premium business hotel at the centre of New Delhi, offering cutting-edge conference facilities, executive lounges, and seamless connectivity for the modern traveller.",
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        ],
        rating: 4.4,
        cheapestPrice: 5500,
        amenities: [
          "WiFi",
          "Business Centre",
          "Gym",
          "Restaurant",
          "Airport Shuttle",
          "Concierge",
        ],
        isFeatured: false,
      },
      {
        name: "Himalayan Retreat",
        city: "Manali",
        address: "Old Manali Road, Manali 175131",
        description:
          "Perched at 7,000 feet in the Himalayas, this cosy mountain retreat offers log cabins, bonfire evenings, adventure sports, and spectacular snow-capped views.",
        images: [
          "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80",
        ],
        rating: 4.5,
        cheapestPrice: 3200,
        amenities: [
          "WiFi",
          "Bonfire",
          "Trekking",
          "Restaurant",
          "Parking",
          "Adventure Sports",
        ],
        isFeatured: true,
      },
      {
        name: "Goa Beach Vibes",
        city: "Goa",
        address: "Calangute Beach Road, North Goa 403516",
        description:
          "Wake up to the sound of waves at this vibrant beachfront resort in Goa. Infinity pool, beach bar, water sports, and direct beach access make it the ultimate getaway.",
        images: [
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
        ],
        rating: 4.3,
        cheapestPrice: 4200,
        amenities: [
          "WiFi",
          "Infinity Pool",
          "Beach Access",
          "Water Sports",
          "Bar",
          "Restaurant",
        ],
        isFeatured: false,
      },
    ]);

    const hotels = Object.values(hotelResult.insertedIds).map((_id) => ({ _id }));
    console.log("🏨 Created 6 hotels");

    // ── Create Rooms ──
    const roomsData = [];

    // Grand Palace Rooms
    roomsData.push(
      {
        hotel: hotels[0]._id,
        title: "Ocean View King Suite",
        description:
          "Spacious suite with panoramic Arabian Sea views, king-size bed and private jacuzzi.",
        roomType: "Suite",
        price: 18000,
        maxOccupancy: 2,
        roomNumber: "601",
        amenities: ["AC", "Jacuzzi", "Mini Bar", "Sea View", "Smart TV"],
      },
      {
        hotel: hotels[0]._id,
        title: "Deluxe Double Room",
        description:
          "Elegant room with city skyline view, twin beds and premium amenities.",
        roomType: "Double",
        price: 8500,
        maxOccupancy: 2,
        roomNumber: "301",
        amenities: ["AC", "Mini Bar", "Smart TV", "Work Desk"],
      },
      {
        hotel: hotels[0]._id,
        title: "Premium Single",
        description:
          "Perfect for solo travellers—compact yet luxurious with all essential amenities.",
        roomType: "Single",
        price: 5500,
        maxOccupancy: 1,
        roomNumber: "201",
        amenities: ["AC", "Smart TV", "Work Desk"],
      },
    );

    // Royal Heritage Rooms
    roomsData.push(
      {
        hotel: hotels[1]._id,
        title: "Maharaja Suite",
        description:
          "Live like royalty in this palatial suite adorned with antique Rajasthani décor.",
        roomType: "Suite",
        price: 14000,
        maxOccupancy: 3,
        roomNumber: "101",
        amenities: ["AC", "Private Pool", "Butler Service", "Minibar"],
      },
      {
        hotel: hotels[1]._id,
        title: "Heritage Deluxe",
        description:
          "Opulent room featuring hand-painted frescoes, four-poster bed and courtyard views.",
        roomType: "Deluxe",
        price: 6200,
        maxOccupancy: 2,
        roomNumber: "205",
        amenities: ["AC", "Smart TV", "Minibar"],
      },
      {
        hotel: hotels[1]._id,
        title: "Family Haveli",
        description:
          "Spacious interconnected rooms ideal for families exploring Jaipur's wonders.",
        roomType: "Family",
        price: 9500,
        maxOccupancy: 5,
        roomNumber: "110",
        amenities: ["AC", "Smart TV", "Extra Beds", "Minibar"],
      },
    );

    // Serene Backwaters Rooms
    roomsData.push(
      {
        hotel: hotels[2]._id,
        title: "Floating Villa",
        description:
          "Exclusive over-water villa with a private deck and direct backwater access.",
        roomType: "Suite",
        price: 12000,
        maxOccupancy: 2,
        roomNumber: "V01",
        amenities: ["AC", "Private Deck", "Kayak", "Smart TV"],
      },
      {
        hotel: hotels[2]._id,
        title: "Garden Cottage",
        description:
          "Cosy cottage surrounded by tropical gardens and the sounds of nature.",
        roomType: "Double",
        price: 4800,
        maxOccupancy: 2,
        roomNumber: "G05",
        amenities: ["AC", "Smart TV", "Outdoor Seating"],
      },
    );

    // Delhi Business Suites Rooms
    roomsData.push(
      {
        hotel: hotels[3]._id,
        title: "Executive Suite",
        description:
          "Corner suite with floor-to-ceiling windows, ideal for executive stays.",
        roomType: "Suite",
        price: 11000,
        maxOccupancy: 2,
        roomNumber: "801",
        amenities: ["AC", "Work Desk", "Smart TV", "Minibar", "Safe"],
      },
      {
        hotel: hotels[3]._id,
        title: "Standard Business",
        description:
          "Well-appointed room for business travellers with high-speed Wi-Fi and desk.",
        roomType: "Single",
        price: 5500,
        maxOccupancy: 1,
        roomNumber: "401",
        amenities: ["AC", "Work Desk", "Smart TV", "Safe"],
      },
    );

    // Himalayan Retreat Rooms
    roomsData.push(
      {
        hotel: hotels[4]._id,
        title: "Snow View Chalet",
        description:
          "Wooden chalet with a fireplace and breathtaking views of Rohtang Pass.",
        roomType: "Deluxe",
        price: 6500,
        maxOccupancy: 2,
        roomNumber: "C01",
        amenities: ["Fireplace", "Smart TV", "Mountain View", "Heater"],
      },
      {
        hotel: hotels[4]._id,
        title: "Family Log Cabin",
        description:
          "Warm log cabin perfect for families with private garden and BBQ area.",
        roomType: "Family",
        price: 8000,
        maxOccupancy: 4,
        roomNumber: "C05",
        amenities: ["Fireplace", "Smart TV", "BBQ", "Heater", "Kitchen"],
      },
    );

    // Goa Beach Vibes Rooms
    roomsData.push(
      {
        hotel: hotels[5]._id,
        title: "Beachfront Bungalow",
        description:
          "Step out directly onto the beach from this charming bungalow with private patio.",
        roomType: "Deluxe",
        price: 7500,
        maxOccupancy: 2,
        roomNumber: "B01",
        amenities: ["AC", "Beach Access", "Private Patio", "Smart TV"],
      },
      {
        hotel: hotels[5]._id,
        title: "Pool Suite",
        description:
          "Luxurious suite with direct pool access and lush garden views.",
        roomType: "Suite",
        price: 9800,
        maxOccupancy: 3,
        roomNumber: "P03",
        amenities: ["AC", "Pool Access", "Minibar", "Smart TV"],
      },
    );

   const roomResult = await db.collection("rooms").insertMany(roomsData);
   const rooms = Object.values(roomResult.insertedIds).map((_id) => ({ _id }));
   console.log(`🛏️  Created ${rooms.length} rooms`);

    // ── Create Sample Bookings ──
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    await db.collection("bookings").insertMany([
      {
        user: users[0]._id,
        hotel: hotels[0]._id,
        room: rooms[0]._id,
        checkIn: nextWeek,
        checkOut: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
        guests: 2,
        totalPrice: 18000 * 3,
        status: "confirmed",
        paymentStatus: "paid",
      },
      {
        user: users[1]._id,
        hotel: hotels[1]._id,
        room: rooms[3]._id,
        checkIn: nextMonth,
        checkOut: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
        guests: 1,
        totalPrice: 14000 * 2,
        status: "pending",
        paymentStatus: "unpaid",
      },
      {
        user: users[2]._id,
        hotel: hotels[4]._id,
        room: rooms[10]._id,
        checkIn: nextWeek,
        checkOut: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000),
        guests: 2,
        totalPrice: 6500 * 5,
        status: "pending",
        paymentStatus: "unpaid",
      },
    ]);
    console.log("📅 Created 3 sample bookings");

    console.log("\n✅ ===== DATABASE SEEDED SUCCESSFULLY =====");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔑 Admin Login  → admin@hotel.com / admin123");
    console.log("👤 User Login   → rahul@email.com / user1234");
    console.log("🏨 Hotels       → 6 hotels added");
    console.log("🛏️  Rooms        →", rooms.length, "rooms added");
    console.log("📅 Bookings     → 3 sample bookings");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
