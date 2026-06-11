const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `room-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.get("/",  getAllRooms);
router.get("/hotel/:hotelId", getRoomsByHotel);
router.get("/:id", getRoomById);
router.post("/", protect, adminOnly, upload.array("images", 5), createRoom);
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;
