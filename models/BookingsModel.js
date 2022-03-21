const { Schema, model } = require("mongoose");

const bookingSchema = new Schema({
    date: { type: String, required: true },
    time: { type: Number, default: Date.now },
    cleanerId: { type: Schema.Types.ObjectId, ref: "Cleaners", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Users", requires: true }
  });
  
  const BookingsModel = model("Bookings", bookingSchema);
  
  module.exports = BookingsModel;