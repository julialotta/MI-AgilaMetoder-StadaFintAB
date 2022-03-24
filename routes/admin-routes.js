const express = require("express");
router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel");
const BookingsModel = require("../models/BookingsModel");

router.get("/customers", async (req, res) => {
  //hämta alla users/customers och rendera i selecion list
  const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();

  res.render("admin/admin-clients", { allCustomers });
});

router.post("/customers", async (req, res) => {
  //en post sker när man klickar på en user i listan. Då renderas rätt info om usern.
  const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();

  for (let i = 0; i < allCustomers.length; i++) {
    if (req.body.selectedList == allCustomers[i]._id) {
      const selectedUser = allCustomers[i]._id;

      const bookingInfo = await BookingsModel.find({
        user: selectedUser,
      })
        .populate("cleaner")
        .lean();

      console.log(selectedUser);
      res.render("admin/admin-clients", {
        allCustomers,
        bookingInfo,
        selectedUser,
      });
    }
  }
});

module.exports = router;
