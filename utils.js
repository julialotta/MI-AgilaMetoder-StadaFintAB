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

  if (bookings.length > 0) {
    // om det finns bokningar:

    //alla städare i listan kollas
    for (let i = 0; i < array.length; i++) {
      let matchingIdArray = [];
      let matchingIdDateArray = [];
      let matchingIdDateTimeArray = [];

      //för varje städare kollar vi om idt matchar någon bokning. om inte kan vi boka den

      for (let j = 0; j < bookings.length; j++) {
        if (bookings[j].cleaner.toString() === array[i]._id.toString()) {
          matchingIdArray.push(bookings[j]);
        }
      }
      if (matchingIdArray.length === 0) {
        console.log("====================================");
        console.log("id not same");
        console.log("====================================");
        return array[i]._id;
      }
      // annars om det finns matchande id, kollar vi datumen
      else {
        for (let k = 0; k < matchingIdArray.length; k++) {
          if (matchingIdArray[k].date == date) {
            matchingIdDateArray.push(matchingIdArray[k]);
          }
        }

        // om inget datum matchar där kan vi boka
        if (matchingIdDateArray.length === 0) {
          console.log("====================================");
          console.log("date not same");
          console.log("====================================");
          return array[i]._id;
        } else {
          for (let l = 0; l < matchingIdDateArray.length; l++) {
            if (matchingIdDateArray[l].time === time) {
              matchingIdDateTimeArray.push(matchingIdDateArray[l]);
            }
          }
          if (matchingIdDateTimeArray.length === 0) {
            console.log("====================================");
            console.log("time not same");
            console.log("====================================");
            return array[i]._id;
          } else {
            console.log("Inga tillgängliga av våra 19 städare");
          }
        }
      }
    }
  } else {
    console.log("====================================");
    console.log("first booking");
    console.log("====================================");
    return array[0]._id;
  }
};
module.exports = {
  hashPassword,
  validateUser,
  comparePassword,
  getCleaner,
};
