const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  adress: { type: String, required: true },
  phone: { type: Number, required: true },
  hashedPassword: { type: String, required: true },
});

const UsersModel = mongoose.model("users", userSchema);

module.exports = UsersModel;
