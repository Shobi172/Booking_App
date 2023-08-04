const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["booked", "cancelled", "available"], 
    default: "available", 
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
