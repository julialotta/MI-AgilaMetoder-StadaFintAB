const BookingsModel = require("../models/BookingsModel.js");
const express = require("express");
const router = express.Router();


// GET - BOOK A CLEANING //
router.get("/", (req, res) => {
      res.render("bookings/book-cleaning");
  });


// POST – BOOK A CLEANING //


module.exports = router;