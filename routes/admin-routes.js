const express = require("express");
const router = express.Router();
const UsersModel = require("../models/UsersModel.js");
const CleanersModel = require("../models/CleanersModel.js");
const BookingsModel = require("../models/BookingsModel.js");
const jwt = require("jsonwebtoken");
const utils = require("../utils");

///////////////////////////////////
// Get all customers and render ///
/// them in the select list ///////
//////////////////////////////////
router.get("/customers", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.admin) {
    res.redirect("/unauthorized");
  } else {
    const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();
    res.render("admin/admin-clients", { allCustomers });
  }
});

/////////////////////
// Get ID from URL //
/////////////////////
router.get("/customers/:id", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.admin) {
    res.redirect("/unauthorized");
  } else {
    const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();

    for (let i = 0; i < allCustomers.length; i++) {
      if (req.params.id == allCustomers[i]._id) {
        const selectedUser = allCustomers[i]._id;

        const bookingInfo = await BookingsModel.find({
          user: selectedUser,
        })
          .populate("cleaner")
          .lean();

        const userInfo = await UsersModel.findById({
          _id: selectedUser,
        }).lean();

        res.render("admin/admin-clients", {
          allCustomers,
          bookingInfo,
          userInfo,
        });
      }
    }
  }
});

///////////////////////////////////////
// Cancel booking from customer page //
///////////////////////////////////////
router.get("/:id/deletebooking", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.admin) {
    res.redirect("/unauthorized");
  }else{
    const booking = await BookingsModel.findById(req.params.id);
    const user = booking.user;
  
    await BookingsModel.findById(req.params.id).deleteOne();
  
    res.redirect("/admin/customers/" + user);
  }
});

/////////////////////////////
// Edit a customer account //
/////////////////////////////
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

///////////////////////////////
// Delete a customer account //
//////////////////////////////
router.get("/:id/deleteaccount", async (req, res) => {
  await UsersModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/customers");
});

/////////////////////////////
// Get admin employee page //
/////////////////////////////
router.get("/employees", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.admin) {
    res.redirect("/unauthorized");
  }else{
    const employees = await CleanersModel.find().lean();
  
    res.render("admin/admin-employees", {
      employees,
    });
  }
});

///////////////////////////
// Get specific employee //
///////////////////////////
router.get("/employees/:id", async (req, res) => {
  const employees = await CleanersModel.find().lean();
  const specificEmployee = await CleanersModel.findById(req.params.id).lean();
  const employeeName = specificEmployee.name;
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.admin) {
    res.redirect("/unauthorized");
  } else {
    for (let i = 0; i < employees.length; i++) {
      if (req.params.id == employees[i]._id) {
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
          employeeName
        });
      }
    }
  }
});

////////////////////////////////////////
// Search for employee in select list //
////////////////////////////////////////
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

//////////////////////////////////////////
// GET for creating an employee account //
//////////////////////////////////////////
router.get("/employee/create", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.admin) {
    res.redirect("/unauthorized");
  }else{
    const employees = await CleanersModel.find().lean();
  
    res.render("admin/admin-employee-create", {
      employees,
    });
  }
});

///////////////////////////////////////////
// POST for creating an employee account //
///////////////////////////////////////////
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

////////////////////////////
//Delete employee account//
///////////////////////////
router.post("/employee/:id/delete", async (req, res) => {
  await CleanersModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/employees");
});

////////////////////////////////////////////////
/// Cancel booking from admin/employee page ////
///////////////////////////////////////////////
router.get("/bookings/:bookingid/:cleanerid/cancel", async (req, res) => {
  const {
    token
  } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  
  if (tokenData == null) {
    res.redirect("/login");
  } else if (!tokenData.admin) {
    res.redirect("/unauthorized");
  } else {
    await BookingsModel.findById(req.params.bookingid).deleteOne();
    res.redirect("/admin/employees/" + req.params.cleanerid);
  }
  });

////////////
// Logout //
///////////
router.get("/logout", async (req, res) => {
  res.cookie("token", " ", {
    maxAge: 0,
  });
  res.redirect("/");
});

module.exports = router;
