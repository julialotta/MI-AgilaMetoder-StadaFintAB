const bcrypt = require("bcrypt");
const CleanersModel = require("./models/CleanersModel");
const BookingsModel = require("./models/BookingsModel");
const cleanerRoute = require("./routes/cleaner-route");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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
  //Kolla tillgänglihet
  let matchingIdArray = [];
  let matchingIdDateArray = [];
  let matchingIdDateTimeArray = [];

  for (let i = 0; i < array.length; i++) {
    if (bookings.length > 0) {
      //kollar om id matchar
      for (let j = 0; j < bookings.length; j++) {
        if (bookings[j].cleaner.toString() === array[i]._id.toString()) {
          matchingIdArray.push(bookings[j]);
          //kollar om date matchar på alla bokningar som har id som matchar
          for (let k = 0; k < matchingIdArray.length; k++) {
            if (matchingIdArray[k].date.toString() === date.toString()) {
              matchingIdDateArray.push(matchingIdArray[k]);

              //kollar om time matchar på alla bokningar som har id som matchar
              for (let l = 0; l < matchingIdDateArray.length; l++) {
                if (
                  matchingIdDateArray[l].time.toString() === time.toString()
                ) {
                  matchingIdDateTimeArray.push(matchingIdDateArray[l]);
                }
                // retur om inte time matchar
                else {
                  return matchingIdDateArray[l]._id;
                }
              }
            }
            // retur om inte date matchar
            else {
              return matchingIdArray[k]._id;
            }
          }
        }
        // retur om inte Id matchar
        else {
          return array[i].Id;
        }
      }
    } else {
      console.log("====================================");
      console.log("first booking");
      console.log("====================================");
      return array[i]._id;
    }
  }
};

module.exports = {
  hashPassword,
  validateUser,
  comparePassword,
  getCleaner,
};
