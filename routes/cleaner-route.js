const express = require("express");
router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const BookingsModel = require("../models/BookingsModel.js");

//behövs dessa?
require("jsonwebtoken");
require("cookie-parser");

router.get("/mypage", async (req, res) => {
  const {
    token
  } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login")
  } else if (!tokenData.cleanerId) {
    res.redirect("/unauthorized")
  } else {
    const cleanings = await BookingsModel.find({
        cleaner: tokenData.cleanerId
      })
      .populate("user")
      .lean();
    res.render("cleaner/my-pages-cleaner", {
      cleanings
    });
  }
});

router.post("/log-out", (req, res) => {
  //dubbelkolla att denna fungerar!
  res.cookie("token", " ", {
    maxAge: 0
  });
  res.redirect("/");
});
module.exports = router;