require("dotenv").config();
const BookingsModel = require("../models/BookingsModel.js");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// GET //

router.get("/", (req, res) => {
  if (!res.locals.loggedIn) {
    res.redirect("login");
  } 
})

// GET - BOOK A CLEANING //
router.get("/book-cleaning", (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const userId = tokenData.userId;

  if (!res.locals.loggedIn) {
    res.redirect("/login");
  } else {
    res.render("customer/book-cleaning");
  }
});

// POST – BOOK A CLEANING //
router.post("/book-cleaning", async (req, res) => {
  const { date, time } = req.body
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const userId = tokenData.userId;

  if(date && time) { 
  const newBooking = new BookingsModel({
    date: date,
    time: time,
    user: userId,
    // cleaner: getCleaner(),
  });

  await newBooking.save();
  console.log(newBooking)
  res.render("customer/book-cleaning");
} else {
  const errorMessage = "Oops! Did you forget to pick a date and time?"
  res.render("customer/book-cleaning", {
    errorMessage
  });
}
});

module.exports = router;