const express = require("express");
router = express.Router();
const UsersModel = require("../models/UsersModel");
const BookingsModel = require("../models/BookingsModel");

//hämta alla users/customers och rendera i selecion list
router.get("/customers", async (req, res) => {
  const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();
  res.render("admin/admin-clients", { allCustomers });
});

//hämta vald user i rullistan och rendera dess bokningar + userinfo
router.post("/customers", async (req, res) => {
  const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();

  for (let i = 0; i < allCustomers.length; i++) {
    if (req.body.selectedList == allCustomers[i]._id) {
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
router.get("/:id/deletecleaning", async (req, res) => {
  await BookingsModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/customers");
});

//edit ett konto
router.get("/:id/editaccount", async (req, res) => {
  res.redirect("xxxxxx");
});

//radera ett konto
router.get("/:id/deleteaccount", async (req, res) => {
  await UsersModel.findById(req.params.id).deleteOne();
  res.redirect("/admin/customers");
});

module.exports = router;
