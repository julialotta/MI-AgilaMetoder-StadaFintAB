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
const { getCleaner } = require("../utils.js");

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
router.post("/book-cleaning", async (req, res) => {});

module.exports = router;
