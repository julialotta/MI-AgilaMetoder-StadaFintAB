require("dotenv").config();
require("./mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");
const loginRouter = require("./routes/login-routes");
const cookieParser = require("cookie-parser");
const customersRouter = require("./routes/customer-routes.js");
const registerroutes = require("./routes/register-routes");

const cleanerRoute = require("./routes/cleaner-route");
const utils = require("./utils");

const app = express();

function findUrl(req, res) {
  console.log(req.params);
  req.params;
}

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      navBar: () => {
        if (utils.findUrl() == "register") {
          return bookingUrl;
        }
      },
    },
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


app.get("/", (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  if (tokenData) {
    const userId = tokenData.userId;
    res.render("home",
    {userId});
  } else {
    res.render("login")
  }
});

app.use("/login", loginRouter);
app.use("/customer", customersRouter);
app.use("/register", registerroutes);
app.use("/cleaner", cleanerRoute);


app.listen(8000, () => {
  console.log("http://localhost:8000");
});
