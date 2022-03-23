require("dotenv").config();
require("./mongoose");

const express = require("express");
const exphbs = require("express-handlebars");
const loginRouter = require("./routes/login-routes");
const cookieParser = require("cookie-parser");
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
app.use("/login", loginRouter);

app.get("/", async (req, res) => {
  res.render("home");
});

app.use("/register", registerroutes);
app.use("/cleaner", cleanerRoute);

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
