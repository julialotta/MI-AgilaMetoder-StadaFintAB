const express = require("express");
router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel");

router.get("/customers", (req, res) => {
  res.render("admin/admin-clients");
});

module.exports = router;
