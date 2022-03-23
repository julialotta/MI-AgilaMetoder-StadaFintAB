const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
  date: { type: String, required: true, default: Date.now },
  time: { type: String, required: true },
  cleaner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cleaners",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
});

const BookingsModel = mongoose.model("Bookings", bookingsSchema);

module.exports = BookingsModel;
