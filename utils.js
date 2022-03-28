const bcrypt = require("bcrypt");
const CleanersModel = require("./models/CleanersModel");
const BookingsModel = require("./models/BookingsModel");
const mongoose = require("mongoose");

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

  // Skapa ny array i shufflad ordning
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

  //Kolla tillgänglihet.
  if (bookings.length > 0) {
    //Alla 19 städare loopas
    for (let i = 0; i < array.length; i++) {
      let matchingIdArray = [];
      let matchingIdDateArray = [];
      let matchingIdDateTimeArray = [];

      //Jämför ID med alla bokningar och vald städare
      for (let j = 0; j < bookings.length; j++) {
        if (bookings[j].cleaner.toString() === array[i]._id.toString()) {
          matchingIdArray.push(bookings[j]);
        }
      }
      // Return om IDt inte finns
      if (matchingIdArray.length === 0) {
        console.log("Booked: ID not same");
        return array[i]._id;
      }
      // Jämför datum med valda städarens tidigare bokningar
      else {
        for (let k = 0; k < matchingIdArray.length; k++) {
          if (matchingIdArray[k].date === date) {
            matchingIdDateArray.push(matchingIdArray[k]);
          }
        }

        // Return om datum inte finns
        if (matchingIdDateArray.length === 0) {
          console.log("Booked: Date not same");
          return array[i]._id;
        }
        // Jämför tid med valda städarens tidigare bokningar på samma datum
        else {
          for (let l = 0; l < matchingIdDateArray.length; l++) {
            if (matchingIdDateArray[l].time === time) {
              matchingIdDateTimeArray.push(matchingIdDateArray[l]);
            }
          }
          // Return om tiden inte finns
          if (matchingIdDateTimeArray.length === 0) {
            console.log("Booked: Time not same");
            return array[i]._id;
          }
          // Vald städare inte tillgänglig. Loopen börjar om.
          else {
            console.log("Städaren inte tillgänglig");
          }
        }
      }
    }
  } else {
    console.log("Booked: first booking");
    return array[0]._id;
  }
};
module.exports = {
  hashPassword,
  validateUser,
  comparePassword,
  getCleaner,
};
