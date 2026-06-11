const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Room title is required"],
    },
    description: {
      type: String,
      required: [true, "Room description is required"],
    },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Suite", "Deluxe", "Family"],
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Room price is required"],
    },
    maxOccupancy: {
      type: Number,
      required: true,
      default: 2,
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
