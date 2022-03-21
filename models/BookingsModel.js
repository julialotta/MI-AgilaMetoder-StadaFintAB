const { Schema, model } = require("mongoose");

const bookingSchema = new Schema({
    date: { type: String, required: true, default: Date.now },
    time: { type: String, required: true },
    cleaner: { type: Schema.Types.ObjectId, ref: "Cleaners", required: false },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: false }
  });
  
  const BookingsModel = model("Bookings", bookingSchema);
  
  module.exports = BookingsModel;