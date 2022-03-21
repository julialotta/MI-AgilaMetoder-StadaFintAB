const express = require("express");
router = express.Router();

//behövs dessa?
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.get("/mypage", (req, res) => {
  res.render("my-pages-cleaner");
});

router.post("/log-out", (req, res) => {
  //dubbelkolla att denna fungerar!
  res.cookie("token", " ", { maxAge: 0 });
  res.redirect("/");
});
module.exports = router;
