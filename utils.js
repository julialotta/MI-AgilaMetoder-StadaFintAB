const bcrypt = require("bcrypt");
const CleanersModel = require("./models/CleanersModel");
const BookingsModel = require("./models/BookingsModel")
const cleanerRoute = require("./routes/cleaner-route");
const mongoose = require('mongoose');

function validateUser(user) {
  let valid = true;
  valid = valid && user.name;
  valid = valid && user.name.length > 0;
  valid = valid && user.email;
  valid = valid && user.email.length > 0;
  valid = valid && user.adress;
  valid = valid && user.adress.length > 0;
  valid = valid && user.phone;
  valid = valid && user.phone > 0;
  valid = valid && user.hashedPassword;
  valid = valid && user.hashedPassword.length > 0;
  return valid;
}

const hashPassword = (password) => {
  const hashValue = bcrypt.hashSync(password, 8);
  return hashValue;
};
const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

const getCleaner = async () => {
  const cleaners = await CleanersModel.find().lean();

  // Slumpa fram en städare
  const randomCleaner = cleaners[Math.floor(Math.random() * cleaners.length)];
  let cleanerId = randomCleaner._id;
  console.log(cleanerId)
  return cleanerId
}

module.exports = {
  hashPassword,
  validateUser,
  comparePassword,
  getCleaner
};
