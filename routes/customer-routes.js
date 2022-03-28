require("dotenv").config();
const BookingsModel = require("../models/BookingsModel.js");
const UsersModel = require("../models/UsersModel.js");

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getCleaner, limitDate } = require("../utils.js");

router.get("/", (req, res) => {
  if (!res.locals.loggedIn) {
    res.redirect("login");
  }
});

// GET - SCHEDULED-CLEANINGS FOR CUSTOMER //
router.get("/mypage", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.userId) {
    res.redirect("/unauthorized");
  } else {
    const bookings = await BookingsModel.find({
      user: tokenData.userId,
    })
      .populate("cleaner")
      .lean();

    res.render("customer/scheduled-cleanings", {
      bookings,
    });
  }
});

// DELETE A BOOKING FROM SCHEDULED-CLEANINGS //
router.get("/:id/remove", async (req, res) => {
  await BookingsModel.findById(req.params.id).deleteOne();
  res.redirect("/customer/mypage");
});

// GET - MY-ACCOUNT FOR CUSTOMER //
router.get("/mypage/myaccount", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.userId) {
    res.redirect("/unauthorized");
  } else {
    const user = await UsersModel.find({
      _id: tokenData.userId,
    }).lean();
    res.render("customer/my-account", {
      user,
    });
  }
});

router.get("/", (req, res) => {
  if (!res.locals.loggedIn) {
    res.redirect("login");
  }
});
// POST - DELETE A BOOKING //
router.get("/id:/remove", (req, res) => {});

// GET - BOOK A CLEANING //
router.get("/book-cleaning", (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const restrictPastDates = limitDate()

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.userId) {
    res.redirect("/unauthorized");
  } else {
    res.render("customer/book-cleaning", 
    { restrictPastDates });
  }
});

// POST – BOOK A CLEANING //
router.post("/book-cleaning", async (req, res) => {
  const { date, time } = req.body;
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const userId = tokenData.userId;
  const randomCleaner = await getCleaner(date, time);


  if (date && time && randomCleaner) {
    const newBooking = new BookingsModel({
      date: date,
      time: time,
      cleaner: randomCleaner,
      user: userId,
    });

    await newBooking.save();

    res.redirect("/customer/mypage");
  } else if (!date && !time) {
    const errorMessage = "Oops! Did you forget to pick a date and time?";
    res.render("customer/book-cleaning", {
      errorMessage,
    });
  } else if (!randomCleaner) {
    const errorMessage =
      "The time and date you've chosen is unfortunately fully booked. Please pick another time.";
    res.render("customer/book-cleaning", {
      errorMessage,
    });
  }
});

module.exports = router;
