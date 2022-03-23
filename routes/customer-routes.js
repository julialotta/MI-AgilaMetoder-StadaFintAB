require("dotenv").config();
const BookingsModel = require("../models/BookingsModel.js");
const UsersModel = require("../models/UsersModel.js");

const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getCleaner } = require("../utils.js");

// GET - SCHEDULED-CLEANINGS FOR CUSTOMER //
router.get("/mypage", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const userId = tokenData.userId;

  const bookings = await BookingsModel.find({ user: userId })
    .populate("cleaner")
    .lean();

  res.render("customer/scheduled-cleanings", { bookings });
});

// GET - MY-ACCOUNT FOR CUSTOMER //
router.get("/mypage/myaccount", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const userId = tokenData.userId;

  const user = await UsersModel.find({ _id: userId }).lean();

  res.render("customer/my-account", { user });
});

// POST - DELETE A BOOKING //
router.get("/id:/remove", (req, res) => {});

router.get("/", (req, res) => {
  if (!res.locals.loggedIn) {
    res.redirect("login");
  }
});

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
  const { date, time } = req.body;

  const { token } = req.cookies;

  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  const userId = tokenData.userId;
  const randomCleaner = await getCleaner(date, time);

  if (date && time) {
    const newBooking = new BookingsModel({
      date: date,
      time: time,
      cleaner: randomCleaner,
      user: userId,
    });

    await newBooking.save();

    res.render("customer/book-cleaning");
  } else {
    const errorMessage = "Oops! Did you forget to pick a date and time?";
    res.render("customer/book-cleaning", {
      errorMessage,
    });
  }
});

module.exports = router;
