const Member = require('../models').Member;
const PassportLocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'memberid',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, memberid, password, done) => {
  const userData = {
    memberid: memberid.trim(),
  };
  bcrypt.hash(password.trim(), 10, function(err, hash) {

    if (err) return done(err);
    
    console.log(hash);
    userData.password = hash;
    Member.findById(userData.memberid)
      .then((member) => {
        console.log(member);
        if(member.password === 'false'){
          member.password = userData.password;
          return member.save();
        } else {
          return done("BRO");
        }
      })
      .then((whathever) => {return done(null)})
      .catch((err) => {
        return done(err);
      });

  });
});