require("dotenv").config();
require("./mongoose");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const loginRouter = require("./routes/login-routes");
const cookieParser = require("cookie-parser");

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

/////////////
// ROUTES //
///////////
app.use("/login", loginRouter);

app.get("/", async (req, res) => {
  res.render("home");
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
