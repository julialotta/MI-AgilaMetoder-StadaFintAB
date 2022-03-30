//////////////////////
// REQUIRES + SETUP //
//////////////////////
require("dotenv").config();
require("./mongoose.js");
const express = require("express");
const exphbs = require("express-handlebars");
const loginRouter = require("./routes/login-routes");
const cookieParser = require("cookie-parser");
const customersRouter = require("./routes/customer-routes.js");
const registerroutes = require("./routes/register-routes.js");
const adminRoute = require("./routes/admin-routes.js");
const cleanerRoute = require("./routes/cleaner-route.js");
const jwt = require("jsonwebtoken");
const UsersModel = require("./models/UsersModel.js");

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

app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.id = tokenData.id;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

app.get("/", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData === null) {
    res.redirect("login");
  } else if (tokenData.userId && !tokenData.admin) {
    const userId = tokenData.userId;
    res.render("customer/scheduled-cleanings", { userId });
  } else if(tokenData.userId && tokenData.admin){
    const allCustomers = await UsersModel.find({ admin: { $ne: true } }).lean();
    res.render("admin/admin-clients", { allCustomers });
  }else {
    res.redirect("cleaner/mypage");
  }
});

app.use("/login", loginRouter);
app.use("/customer", customersRouter);
app.use("/register", registerroutes);
app.use("/cleaner", cleanerRoute);
app.use("/admin", adminRoute);

/////////////////
// ERROR PAGES //
/////////////////

app.use("/unauthorized", (req, res) => {
  res.status(403).render("errors/unauthorized");
});

app.use("/", (req, res) => {
  res.status(404).render("errors/error");
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
