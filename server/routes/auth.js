const express = require('express');
const validator = require('validator');
const passport = require('passport');
var Member = require('../models').Member;
const jwt = require('jsonwebtoken');

var passwordless = require('passwordless');

const router = new express.Router();

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.phonenumber !== 'string' || payload.phonenumber.trim().length < 12) {
    isFormValid = false;
    errors.username = 'Please provide your phone number.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      console.log(err);

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }


    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});

router.post('/truesignup', (req, res, next) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'You have successfully signed up! Now you should be able to log in.'
      });
    }

  })(req, res, next);
});

router.post('/signup', passwordless.requestToken(function(user, delivery, callback, req){
  console.log(user);
  Member.findOne( {where: {phoneNumber: user}})
    .then((user) => {
      if(user.password !== 'false'){
        callback(null, null);
      } else if(user){
        console.log(user);
        callback(null, user.id); 
      } else {
        console.log("No user found");
        callback(null, null);
      }
    })
    .catch(err => {console.log(err); callback(null, null)});
}), function(req, res){
  res.status(200).send({uid: req.passwordless.uidToAuth});
});

router.post('/verify', passwordless.acceptToken({ allowPost: true, successRedirect: '/signupfinal' }), (req, res) => {
  res.status(200).send({message: "success"});
});

module.exports = router;