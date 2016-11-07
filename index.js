require('dotenv').config();
var http = require('http');
var mongoose = require('mongoose');
var config = require('./config');

var port = process.env.PORT || 3000;

// Initialize database connection - throws if database connection can't be
// established
mongoose.connect(config.mongoUrl);

// Create Express web app
var app = require('./webapp');

// Create an HTTP server and listen on the configured port
var server = http.createServer(app);
server.listen(port, function() {
    console.log('Express server listening on *:' + port);
});
