const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel.js");
const CleanersModel = require("../models/CleanersModel.js");
const { comparePassword } = require(".././utils");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  
  //Söker bland kunder
  UsersModel.findOne({ email }, (err, user) => {
      if (user && comparePassword(password, user.hashedPassword)){
        const userData = { userId: user._id, email };
        const accessToken = jwt.sign(userData, process.env.JWTSECRET);

        res.cookie("token", accessToken);
        res.redirect("/customer/mypage");
      } else if(user && !comparePassword(password, user.hashedPassword)){
          res.render("login", {loginFailed: true})
      }
  });

  //Söker bland städare
  CleanersModel.findOne({email}, (err, cleaner) => {
    if (cleaner && comparePassword(password, cleaner.hashedPassword)){
      const cleanerData = { cleanerId: cleaner._id, email };
      const accessToken = jwt.sign(cleanerData, process.env.JWTSECRET);

      res.cookie("token", accessToken);
      res.redirect("/cleaner/mypage");
    } else if(cleaner && !comparePassword(password, cleaner.hashedPassword)){
        res.render("login", {loginFailed: true})
    } else{
      res.render("login", {loginFailed: true})
    }
  })

});

module.exports = router;
