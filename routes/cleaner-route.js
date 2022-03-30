const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const BookingsModel = require("../models/BookingsModel.js");

///////////////////////
// My page / Cleaner //
///////////////////////
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

////////////
// Logout //
////////////
router.post("/log-out", (req, res) => {
  res.cookie("token", " ", {
    maxAge: 0
  });
  res.redirect("/");
});

module.exports = router;