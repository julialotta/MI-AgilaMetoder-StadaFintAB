const bcrypt = require("bcrypt");
const CleanersModel = require("./models/CleanersModel");
const BookingsModel = require("./models/BookingsModel");
const mongoose = require("mongoose");

//////////////////////////
// User Form Validation //
//////////////////////////
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

///////////////////
// Hash password //
///////////////////
const hashPassword = (password) => {
  const hashValue = bcrypt.hashSync(password, 8);
  return hashValue;
};
const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

/////////////////////////////////////////
// Get cleaner and check availability ///
/////////////////////////////////////////
const getCleaner = async (date, time) => {
  // Get alla cleaners from CleanersModel
  let cleaners = await CleanersModel.find().lean();
  // Get all bookings from BookingsModel
  let bookings = await BookingsModel.find().lean();

  // Create new shuffled array 
  let array = [];
  for (let i = 0; i < cleaners.length; i++) {
    array.push(cleaners[i]);
  }
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };
  shuffleArray(array);

  // Check availability
  if (bookings.length > 0) {
    // Loop through all 19 cleaners
    for (let i = 0; i < array.length; i++) {
      let matchingIdArray = [];
      let matchingIdDateArray = [];
      let matchingIdDateTimeArray = [];

      // Compare ID with all bookings and chosen cleaner
      for (let j = 0; j < bookings.length; j++) {
        if (bookings[j].cleaner.toString() === array[i]._id.toString()) {
          matchingIdArray.push(bookings[j]);
        }
      }
      // Return if ID doesn't exist
      if (matchingIdArray.length === 0) {
        return array[i]._id;
      }
      // Compare date with the chosen cleaner's scheduled bookings
      else {
        for (let k = 0; k < matchingIdArray.length; k++) {
          if (matchingIdArray[k].date === date) {
            matchingIdDateArray.push(matchingIdArray[k]);
          }
        }
        // Return if date doesn't exist
        if (matchingIdDateArray.length === 0) {
          console.log("Booked: Date not same");
          return array[i]._id;
        }
        // Compare time with the chosen cleaner's scheduled bookings
        else {
          for (let l = 0; l < matchingIdDateArray.length; l++) {
            if (matchingIdDateArray[l].time === time) {
              matchingIdDateTimeArray.push(matchingIdDateArray[l]);
            }
          }
          // Return if time doesn't exist
          if (matchingIdDateTimeArray.length === 0) {
            return array[i]._id;
          }
          // Chosen cleaner not available. Loop starts over
          else {
            console.log("Städaren inte tillgänglig");
          }
        }
      }
    }
  } else {
    return array[0]._id;
  }
};

/////////////////////////////////////////////////////
// Restrict past dates when booking a new cleaning //
/////////////////////////////////////////////////////
const limitDate = () => {
  let date = new Date().toISOString().split('T')[0]
  return date
}

module.exports = {
  hashPassword,
  validateUser,
  comparePassword,
  getCleaner,
  limitDate
};
