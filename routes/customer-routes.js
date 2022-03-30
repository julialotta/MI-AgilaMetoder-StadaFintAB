require("dotenv").config();
const BookingsModel = require("../models/BookingsModel.js");
const UsersModel = require("../models/UsersModel.js");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getCleaner, limitDate } = require("../utils.js");

///////////////////////////////
// Redirect if not logged in //
///////////////////////////////
router.get("/", (req, res) => {
  if (!res.locals.loggedIn) {
    res.redirect("login");
  }
});

//////////////////////////////////////
// Scheduled cleanings for customer //
//////////////////////////////////////
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

////////////////////
// Cancel booking //
////////////////////
router.get("/:id/remove", async (req, res) => {
  await BookingsModel.findById(req.params.id).deleteOne();
  res.redirect("/customer/mypage");
});

///////////////////////////
// My account / customer //
///////////////////////////
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

////////////////////////////
// GET - Book a cleaning //
///////////////////////////
router.get("/book-cleaning", (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const restrictPastDates = limitDate();

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.userId) {
    res.redirect("/unauthorized");
  } else {
    res.render("customer/book-cleaning", { restrictPastDates });
  }
});

////////////////////////////
// POST – Book a cleaning //
////////////////////////////
router.post("/book-cleaning", async (req, res) => {
  const { date, time } = req.body;
  const randomCleaner = await getCleaner(date, time);

  if (date && time) {
    const bookingObject = {
      date: date,
      time: time,
    };
    res.render("customer/confirm-cleaning", { bookingObject });
  } else if (!date || !time) {
    const errorMessage = "Oops! Did you forget to pick a time or date?";
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

//////////////////////
// Confirm cleaning //
//////////////////////
router.post("/confirm-cleaning", async (req, res) => {
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
  } else {
    const errorMessage = "Oops! Something went wrong";
    res.render("customer/book-cleaning", {
      errorMessage,
    });
  }
});

module.exports = router;
