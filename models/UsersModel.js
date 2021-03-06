const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  adress: { type: String, required: true },
  phone: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

const UsersModel = mongoose.model("Users", userSchema);

module.exports = UsersModel;
