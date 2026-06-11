const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
const {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
  sendBookingApprovalEmail,
  sendCancellationEmail,
} = require("../utils/emailService");

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { hotel, room, checkIn, checkOut, guests, specialRequests } = req.body;

    // Verify room exists
    const roomData = await Room.findById(room);
    if (!roomData) return res.status(404).json({ message: "Room not found" });
    if (!roomData.isAvailable) return res.status(400).json({ message: "Room is not available" });

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights < 1) return res.status(400).json({ message: "Check-out must be after check-in" });

    const totalPrice = nights * roomData.price;

    const booking = await Booking.create({
      user: req.user._id,
      hotel,
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests,
    });

    await booking.populate([
      { path: "hotel", select: "name city address images" },
      { path: "room", select: "title roomType price" },
    ]);

    // Send emails asynchronously (don't wait for them)
    const user = req.user;
    sendBookingConfirmationEmail(user, booking).catch(err => console.error("Email error:", err));
    sendAdminNotificationEmail(process.env.ADMIN_EMAIL || "admin@hotel.com", booking, user).catch(err => console.error("Email error:", err));

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hotel", "name city address images")
      .populate("room", "title roomType price images")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("hotel", "name city address images amenities")
      .populate("room", "title roomType price images roomNumber")
      .populate("user", "name email phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Allow access only to booking owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking (user)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("hotel", "name city address images")
      .populate("room", "title roomType price");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Send cancellation email
    sendCancellationEmail(booking.user, booking).catch(err => console.error("Email error:", err));

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("hotel", "name city")
      .populate("room", "title roomType")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("hotel", "name city address images amenities")
      .populate("room", "title roomType price images roomNumber");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    if (status === "confirmed") booking.paymentStatus = "paid";
    await booking.save();

    // Send approval email if status is confirmed
    if (status === "confirmed") {
      sendBookingApprovalEmail(booking.user, booking).catch(err => console.error("Email error:", err));
    }

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking, getMyBookings, getBookingById,
  cancelBooking, getAllBookings, updateBookingStatus,
};
