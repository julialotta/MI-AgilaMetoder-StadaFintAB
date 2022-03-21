const express = require("express");
router = express.Router();

router.get("/mypage", (req, res) => {
  res.render("my-pages-cleaner");
});

router.post("/log-out", (req, res) => {
  //OBS ta bort cookies vid utloggning
  res.redirect("/");
});
module.exports = router;
