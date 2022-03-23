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

const getCleaner = async (date, time) => {
  // Hämta alla städare från CleanersModel
  let cleaners = await CleanersModel.find().lean();
  // Hämta alla bokningar från BookingsModel
  let bookings = await BookingsModel.find().lean();

  // Slumpa fram en städare från CleanersModel
  const randomCleaner = cleaners[Math.floor(Math.random() * cleaners.length)];
  
  // Lägg städarens id i en ny variabel
  let cleanerId = randomCleaner._id;
  
  // Testkod för att kolla tillgänglighet - fungerar ej just nu :( 

  // Skapa ny lista för städare
  // let newCleanerslist = []

  // Hämta id från alla städare
  // cleaners.forEach(cleaner => {
  //   let id = cleaner._id;
  //   // Pusha dem till nya listan
  //   newCleanerslist.push(id)
  // });

  // Shuffla listan med städare
  // newCleanerslist = newCleanerslist.sort(() => Math.random() - 0.5)

  // Kolla om städaren i bokningen är uppbokad på samma datum & tid
  // Just nu kollar den cleanerId från rad 41, inte id:et från shufflade listan

  // bookings.forEach(booking => {
  //   if (booking.cleaner === cleanerId && booking.date === date && booking.time === time) {
  //     console.log("Cleaner is busy")
  //   } else {
  //     return cleanerId
  //   }
  // });

  return cleanerId
}

module.exports = {
  hashPassword,
  validateUser,
  comparePassword,
  getCleaner
};
