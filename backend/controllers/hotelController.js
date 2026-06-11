const Hotel = require("../models/Hotel");

// @desc    Get all hotels (with search/filter)
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, rating, search } = req.query;

    let query = {};

    if (city) query.city = { $regex: city, $options: "i" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      query.cheapestPrice = {};
      if (minPrice) query.cheapestPrice.$gte = Number(minPrice);
      if (maxPrice) query.cheapestPrice.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };

    const hotels = await Hotel.find(query).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Admin
const createHotel = async (req, res) => {
  try {
    const { name, city, address, description, cheapestPrice, amenities, isFeatured, rating } = req.body;

    // Handle uploaded images
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const hotel = await Hotel.create({
      name, city, address, description,
      cheapestPrice, amenities: amenities ? JSON.parse(amenities) : [],
      isFeatured: isFeatured === "true",
      rating: rating || 0,
      images,
    });

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Admin
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const updates = { ...req.body };
    if (updates.amenities && typeof updates.amenities === "string") {
      updates.amenities = JSON.parse(updates.amenities);
    }
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    await hotel.deleteOne();
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
const getFeaturedHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isFeatured: true }).limit(6);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHotels, getHotelById, createHotel, updateHotel, deleteHotel, getFeaturedHotels };
