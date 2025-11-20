const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/User");

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: "No user with that email" });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return done(null, false, { message: "Incorrect password" });
    return done(null, user);
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user)).catch(err => done(err));
  });
}

module.exports = initialize;