const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel.js");
const { comparePassword } = require(".././utils");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;
    
  UsersModel.findOne({ email }, (err, user) => {
      if (user && comparePassword(password, user.hashedPassword)){
        const userData = { userId: user._id, email };
        const accessToken = jwt.sign(userData, process.env.JWTSECRET);

        res.cookie("token", accessToken);
        res.redirect("/");
      } else {
          res.render("login", {loginFailed: true})
      }
  });
});

module.exports = router;
