const jwt = require('jsonwebtoken');
const Member = require('../models').Member;


/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    console.log('No header!');
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  // console.log(token);
  // decode the token using a secret key-phrase
  return jwt.verify(token, process.env.SECRET, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { console.log(err); return res.status(401).end(); }

    const userId = decoded.sub;
    console.log(userId);
    // check if a user exists
    return Member.findById(userId)
          .then((user) => {
            if(!user){
              console.log("user did not exist with id:" + decoded);
              return res.status(401).end();
            } else if (user.password === 'false'){
              console.log('Member: ' + userid + " needs a password.");
              return res.status(401).end();
            }
            req.authid = user.id;
            console.log("USER ID FROM TOKEN: " + user.id);
            return next();
          })
          .catch((err) => {
            console.log(err);
            return res.status(401).end();
          });
  });
};