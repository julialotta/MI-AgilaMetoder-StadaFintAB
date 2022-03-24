const express = require("express");
router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel.js");
const CleanersModel = require("../models/CleanersModel.js")

router.get("/customers", (req, res) => {
  res.render("admin/admin-clients");
});

router.get("/employees", async (req, res) => {
  const employees = await CleanersModel.find().lean()

  res.render("admin/admin-employees", {
    employees
  });
});

module.exports = router;
