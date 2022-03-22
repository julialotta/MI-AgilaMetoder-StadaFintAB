require("dotenv").config();
require("./mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const loginRouter = require("./routes/login-routes");
const cookieParser = require("cookie-parser");
const customersRouter = require("./routes/customer-routes.js");
const registerroutes = require("./routes/register-routes");

const cleanerRoute = require("./routes/cleaner-route");

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

app.use("/customer", customersRouter);
app.use("/register", registerroutes);
app.use("/cleaner", cleanerRoute);

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
