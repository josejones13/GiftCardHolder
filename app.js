const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const methodOverride = require("method-override");
const path = require("path");

dotenv.config();
const initializePassport = require("./passport-config");
initializePassport(passport);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;  // user now available in ALL EJS templates
  next();
});

app.set("view engine", "ejs");

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/authRoutes");
const giftCardRoutes = require("./routes/giftCardRoutes");

app.use("/", authRoutes);
app.use("/cards", giftCardRoutes);

app.get("/", (req, res) => { res.render("home"); });

app.use((req, res) => {
  res.status(404).render("error", { errorMessage: "Page not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));