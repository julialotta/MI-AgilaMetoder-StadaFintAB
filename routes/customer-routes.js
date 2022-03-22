require("dotenv").config();
const BookingsModel = require("../models/BookingsModel.js");
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const router = express.Router();
const jwt = require("jsonwebtoken");

// GET - SCHEDULED-CLEANINGS FOR CUSTOMER //
router.get("/mypage", async (req, res) => {
  // hämta ID på den som är inloggad
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const userId = tokenData.userId;

  //hämta bookning av inloggad user
  const booking = await BookingsModel.find({ user: userId }).lean();
  console.log(booking);

  res.render("customer/scheduled-cleanings");
});

// GET - MY-ACCOUNT FOR CUSTOMER //
router.get("/mypage/myaccount", (req, res) => {
  res.render("customer/my-account");
});

// POST - DELETE A BOOKING //
router.get("/id:/remove", (req, res) => {});

// GET - BOOK A CLEANING //
router.get("/book-cleaning", (req, res) => {
  res.render("customer/book-cleaning");
});

// POST – BOOK A CLEANING //
router.post("/book-cleaning", async (req, res) => {
  const { date, time } = req.body;

  if (date && time) {
    const newBooking = new BookingsModel({
      date: date,
      time: time,
      // user: {
      //   _id: user._id,
      // },
      // cleaner: getCleaner(),
    });

    await newBooking.save();
    console.log(newBooking);
    res.render("customer/book-cleaning");
  } else {
    const errorMessage = "Oops! Did you forget to pick a date and time?";
    res.render("customer/book-cleaning", {
      errorMessage,
    });
  }
});

module.exports = router;
