const express = require("express");
const router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel.js");
const CleanersModel = require("../models/CleanersModel.js")
const BookingsModel = require("../models/BookingsModel.js");
const registerRouter = require("./register-routes.js");
const utils = require("../utils");

router.get("/customers", (req, res) => {
  res.render("admin/admin-clients");
});

// READ – Admin employee page

router.get("/employees", async (req, res) => {
  const employees = await CleanersModel.find().lean()

  res.render("admin/admin-employees", {
    employees
  });
});

// POST – Search for employee i select list

router.post("/employees", async (req, res) => {
  const employees = await CleanersModel.find().lean()

  for (let i = 0; i < employees.length; i++) {
    if (req.body.employee == employees[i]._id) {
      let selectedEmployee = employees[i]._id;

      const bookings = await BookingsModel.find({
        cleaner: selectedEmployee
      }).populate("user")
      .lean()

      res.render("admin/admin-employees", {
        employees,
        selectedEmployee,
        bookings
      });
    }
  }
})

// READ – Create employee account

router.get("/employee/create", async (req, res) => {
  const employees = await CleanersModel.find().lean()

  res.render("admin/admin-employee-create", {
    employees
  })
})

// POST – Create employee account

router.post("/employee/create", async (req, res) => {

  const password = req.body.password;

  const newCleaner = new CleanersModel({
    name: req.body.name,
    email: req.body.email,
    hashedPassword: utils.hashPassword(password),
  });
  
  await newCleaner.save();
  res.redirect("/admin/employees")
})

// POST - Delete employee account
router.post("/employee/:id/delete", async (req, res) => {
  await CleanersModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/employees")
})

module.exports = router;