var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');
var config = require('./config');

// Create Express web app
var app = express();
app.set('view engine', 'jade');

// Use morgan for HTTP request logging
app.use(morgan('combined'));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'client')));

// Parse incoming form-encoded HTTP bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create and manage HTTP sessions for all requests
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

// Use connect-flash to persist informational messages across redirects
app.use(flash());

// Configure application routes
require('./server/controllers/router')(app);

// Handle 404
app.use(function (request, response, next) {
    response.status(404);
    response.sendFile(path.join(__dirname, 'client', 'public', '404.html'));
});

// Unhandled errors (500)
app.use(function(err, request, response, next) {
    console.error('An application error has occurred:');
    console.error(err);
    console.error(err.stack);
    response.status(500);
    response.sendFile(path.join(__dirname, 'client', 'public', '500.html'));
});

// Export Express app
module.exports = app;
