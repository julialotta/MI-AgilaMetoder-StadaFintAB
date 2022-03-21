const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel.js");
const utils = require("../utils");

router.get("/register", async (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  const { email, name, adress, phone, password, confirmPassword } = req.body;

  UsersModel.findOne({ email }, async (err, user) => {
    if (user) {
      res.render("users/register", {
        error: "Seems like this email already have an account",
      });
    } else if (password.length <= 4) {
      res.render("users/register", {
        error: "Your password must have at least 5 characters",
      });
    } else if (password !== confirmPassword) {
      res.render("users/register", {
        error: "Passwords don't match",
      });
    } else {
      const newUser = new UsersModel({
        name,
        email,
        adress,
        phone,
        hashedPassword: utils.hashPassword(password),
      });
      console.log(newUser);
      if (utils.validateUser(newUser)) {
        await newUser.save();
        UsersModel.findOne({ name }, (err, user) => {
          const userData = { userId: user._id, name };
          const accessToken = jwt.sign(userData, process.env.JWTSECRET);
          res.cookie("token", accessToken);
          res.redirect("/");
        });
      } else {
        res.render("users/register", {
          error: "You have to enter some data",
        });
      }
    }
  });
});

module.exports = router;
