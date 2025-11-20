const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/cards");
  next();
}
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get("/register", checkNotAuthenticated, (req, res) => res.render("register"));
router.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    passwordHash: hash
  });
  res.redirect("/login");
});

router.get("/login", checkNotAuthenticated, (req, res) => res.render("login"));
router.post("/login",
  passport.authenticate("local", { successRedirect: "/cards", failureRedirect: "/login" })
);

router.get("/logout", (req, res) => { req.logout(() => res.redirect("/")); });

module.exports = router;