const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

// @desc    Get all rooms for a hotel
// @route   GET /api/rooms/hotel/:hotelId
// @access  Public
const getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel", "name city address");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Admin
const createRoom = async (req, res) => {
  try {
    const { hotel, title, description, roomType, price, maxOccupancy, roomNumber, amenities } = req.body;

    // Verify hotel exists
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) return res.status(404).json({ message: "Hotel not found" });

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const room = await Room.create({
      hotel, title, description, roomType, price,
      maxOccupancy, roomNumber,
      amenities: amenities ? JSON.parse(amenities) : [],
      images,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Admin
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const updates = { ...req.body };
    if (updates.amenities && typeof updates.amenities === "string") {
      updates.amenities = JSON.parse(updates.amenities);
    }
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Admin
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    await room.deleteOne();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rooms (admin)
// @route   GET /api/rooms
// @access  Admin
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hotel", "name city");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoomsByHotel, getRoomById, createRoom, updateRoom, deleteRoom, getAllRooms };
