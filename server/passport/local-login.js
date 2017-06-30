const jwt = require('jsonwebtoken');
const Member = require('../models').Member;
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'phonenumber',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, phonenumber, password, done) => {
  const userData = {
    phonenumber: phonenumber.trim(),
    password: password.trim()
  };

  console.log(password);

  return Member.findOne({where: {phoneNumber: userData.phonenumber}})
             .then((member) => {
                 if(!member) {
                    const error = new Error('Incorrect email or password');
                    error.name = 'IncorrectCredentialsError';
                    console.log(error);
                    return done(error);
                } else {
                    //console.log(user);
                    return member.comparePasswordsAndGenToken(userData.password);;
                }
             })
             .then((token, data) => {
                 return done(null, token, data);
             })
             .catch((err) => {
                 return done(err);
             })
});