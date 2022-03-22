const mongoose = require("mongoose");

const cleanerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  hashedPassword: { type: String, required: true },
});

const CleanersModel = mongoose.model("cleaners", cleanerSchema);

module.exports = CleanersModel;
