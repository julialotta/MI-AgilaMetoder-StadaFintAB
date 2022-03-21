require("dotenv").config();
const BookingsModel = require("../models/BookingsModel.js");
const express = require("express");
const router = express.Router();

// GET - BOOK A CLEANING //
router.get("/", (req, res) => {
  res.render("bookings/book-cleaning");
});

// POST – BOOK A CLEANING //
router.post("/", async (req, res) => {
  const { date, time } = req.body

  if(date && time) { 
  const newBooking = new BookingsModel({
    date: date,
    time: time,
    // user: {
    //   _id: user._id,
    // },
    // cleaner: getCleaner(),
  });

  await newBooking.save();
  console.log(newBooking)
  res.render("bookings/book-cleaning");
} else {
  const errorMessage = "Oops! Did you forget to pick a date and time?"
  res.render("bookings/book-cleaning", {
    errorMessage
  });
}
});

module.exports = router;