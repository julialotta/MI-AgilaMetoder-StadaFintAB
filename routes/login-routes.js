const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel.js");
const CleanersModel = require("../models/CleanersModel.js");
const { comparePassword } = require(".././utils");

router.get("/", (req, res) => {
  res.render("login", {customer: true});
});

router.get("/employee", (req,res) => {
  res.render("login", {customer: false});
})

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  
  UsersModel.findOne({ email }, (err, user) => {
      if (user && comparePassword(password, user.hashedPassword)){
        const userData = { userId: user._id, email };
        const accessToken = jwt.sign(userData, process.env.JWTSECRET);
        res.cookie("token", accessToken);
        if(!user.admin){
          res.redirect("/customer/mypage");
        }else if(user.admin){
          res.redirect("/admin/customers")
        }
      } else {
        res.render("login", {loginFailed: true, customer: true})
      }
  });

  
});
router.post("/cleaner", async (req,res) => {
  const { email, password } = req.body;
 
  CleanersModel.findOne({email}, (err, cleaner) => {
    if (cleaner && comparePassword(password, cleaner.hashedPassword)){
      const cleanerData = { cleanerId: cleaner._id, email };
      const accessToken = jwt.sign(cleanerData, process.env.JWTSECRET);
  
      res.cookie("token", accessToken);
      res.redirect("/cleaner/mypage");
    } else {
      res.render("login", {loginFailed: true, customer: false})
    }
  }) 

})

module.exports = router;
