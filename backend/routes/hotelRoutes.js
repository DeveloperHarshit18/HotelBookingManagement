const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getFeaturedHotels,
} = require("../controllers/hotelController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `hotel-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.get("/", getHotels);
router.get("/featured", getFeaturedHotels);
router.get("/:id", getHotelById);
router.post("/", protect, adminOnly, upload.array("images", 10), createHotel);
router.put("/:id", protect, adminOnly, upload.array("images", 10), updateHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);

module.exports = router;
