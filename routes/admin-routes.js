const express = require("express");
const router = express.Router();
const UsersModel = require("../models/UsersModel.js");
const CleanersModel = require("../models/CleanersModel.js");
const BookingsModel = require("../models/BookingsModel.js");
const utils = require("../utils");

//hämta alla users/customers och rendera i selecion list
router.get("/customers", async (req, res) => {
  const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();
  res.render("admin/admin-clients", { allCustomers });
});

//hämta och ge ID i urlen
router.get("/customers/:id", async (req, res) => {
  const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();

  for (let i = 0; i < allCustomers.length; i++) {
    if (req.params.id == allCustomers[i]._id) {
      const selectedUser = allCustomers[i]._id;

      const bookingInfo = await BookingsModel.find({
        user: selectedUser,
      })
        .populate("cleaner")
        .lean();

      const userInfo = await UsersModel.findById({ _id: selectedUser }).lean();

      res.render("admin/admin-clients", {
        allCustomers,
        bookingInfo,
        userInfo,
      });
    }
  }
});

//radera en bokning
router.get("/:id/deletebooking", async (req, res) => {
  const booking = await BookingsModel.findById(req.params.id);
  const user = booking.user;

  await BookingsModel.findById(req.params.id).deleteOne();

  res.redirect("/admin/customers/" + user);
});

//edit ett konto
router.post("/customers/:id/edit", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  userEdit = user._id;
  user.email = req.body.email;
  user.name = req.body.name;
  user.adress = req.body.adress;
  user.phone = req.body.phone;

  await UsersModel.findByIdAndUpdate(
    { _id: user._id },
    {
      email: req.body.email,
      name: req.body.name,
      adress: req.body.adress,
      phone: req.body.phone,
    }
  );

  res.redirect("/admin/customers/" + userEdit);
});

//radera ett konto
router.get("/:id/deleteaccount", async (req, res) => {
  await UsersModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/customers");
});

// READ – Admin employee page

router.get("/employees", async (req, res) => {
  const employees = await CleanersModel.find().lean();

  res.render("admin/admin-employees", {
    employees,
  });
});

// POST – Search for employee i select list

router.post("/employees", async (req, res) => {
  const employees = await CleanersModel.find().lean();

  for (let i = 0; i < employees.length; i++) {
    if (req.body.employee == employees[i]._id) {
      let selectedEmployee = employees[i]._id;

      const bookings = await BookingsModel.find({
        cleaner: selectedEmployee,
      })
        .populate("user")
        .populate("cleaner")
        .lean();

      res.render("admin/admin-employees", {
        employees,
        selectedEmployee,
        bookings,
      });
    }
  }
});

// READ – Create employee account

router.get("/employee/create", async (req, res) => {
  const employees = await CleanersModel.find().lean();

  res.render("admin/admin-employee-create", {
    employees,
  });
});

// POST – Create employee account

router.post("/employee/create", async (req, res) => {
  const password = req.body.password;

  const newCleaner = new CleanersModel({
    name: req.body.name,
    email: req.body.email,
    hashedPassword: utils.hashPassword(password),
  });

  await newCleaner.save();
  res.redirect("/admin/employees");
});

// POST - Delete employee account
router.post("/employee/:id/delete", async (req, res) => {
  await CleanersModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/employees");
});

// Cancel booking
router.get("/bookings/:id/cancel", async (req, res) => {
  await BookingsModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/employees");
});

// Logout
router.get("/logout", async (req, res) => {
  res.cookie("token", " ", {
    maxAge: 0
  });
  res.redirect("/");
})

module.exports = router;
