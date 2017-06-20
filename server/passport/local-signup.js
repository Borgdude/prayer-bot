const Users = require('../models').Users;
const PassportLocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {
  const userData = {
    username: username.trim(),
  };
  bcrypt.hash(password.trim(), 10, function(err, hash) {

    if (err) return done(err);
    
    console.log(hash);
    userData.password = hash;
    Users.create(userData)
      .then(() => done(null))
      .catch((err) => done(err));

  });
  
  console.log(userData.passworded);
});