require("dotenv").config();
require("./mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const customersRouter = require("./routes/customer-routes.js");
const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {},
  })
);

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("home");
});

app.use("/customer", customersRouter);

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
