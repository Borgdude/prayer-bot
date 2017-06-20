const jwt = require('jsonwebtoken');
const Users = require('../models').Users;
const PassportLocalStrategy = require('passport-local').Strategy;


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
    password: password.trim()
  };

  console.log(password);

  return Users.findOne({where: {username: userData.username}})
             .then((user) => {
                 if(!user) {
                     const error = new Error('Incorrect email or password');
                    error.name = 'IncorrectCredentialsError';

                    return done(error);
                }
                return user;
             })
             .then((user) => user.comparePasswordsAndGenToken(userData.password))
             .then((token, data) => {
                 return done(null, token, data);
             })
             .catch((err) => {
                 return done(err);
             })
});