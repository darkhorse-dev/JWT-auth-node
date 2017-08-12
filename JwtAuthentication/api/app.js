'use strict';

/********************************
Dependencies
********************************/

var mongoose = require('mongoose');// MongoDB connection library
const config = require('../config/config');
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
  throw new Error('Unable to connect to database at ' + config.db);
});

/********Database*********************/
var glob = require('glob');
var models = glob.sync('./model/*.js');
models.forEach(function(model) {
  require(model);
});

/********************************
Express Settings
********************************/
var bodyParser = require('body-parser');// parse HTTP requests
var express = require('express');// server middleware
var app = express();
exports.app =express(); // Added
var dir = __dirname;
dir  = dir.replace("/api","");
dir = dir+ "/frontend/app";
app.use(express.static(dir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/********************************
 Routing (Done via Help of route.js)
 ********************************/
 const varIndexCtrl = require('./controller/indexCtrl');
 require('./routes')(app);

/********************************
Ports
********************************/
app.listen(9090, function() {
  console.log("Node server running on " + 9090);
});
