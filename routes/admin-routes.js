const express = require("express");
router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel.js");
const CleanersModel = require("../models/CleanersModel.js")
const BookingsModel = require("../models/BookingsModel.js")

router.get("/customers", (req, res) => {
  res.render("admin/admin-clients");
});

router.get("/employees", async (req, res) => {
  const employees = await CleanersModel.find().lean()

  res.render("admin/admin-employees", {
    employees
  });
});

router.post("/employees", async (req, res) => {
  const employees = await CleanersModel.find().lean()

  for (let i = 0; i < employees.length; i++) {
    if (req.body.employee == employees[i]._id) {
      let selectedEmployee = employees[i]._id;

      const bookings = await BookingsModel.find({
        cleaner: selectedEmployee
      }).lean()


      res.render("admin/admin-employees", {
        employees,
        selectedEmployee,
        bookings
      });
    }
  }
})

router.post("/employee/delete", async (req, res) => {
  await BookingsModel.findById(req.params.id).deleteOne();
  res.redirect("/employees");
})

module.exports = router;