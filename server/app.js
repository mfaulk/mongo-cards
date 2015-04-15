/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
//mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
// if(config.seedDB) { require('./config/seed'); }
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var db;

// Connection URL
//var mongo_url = 'mongodb://localhost:27017/myproject';
MongoClient.connect(config.mongo.uri, function(err, database) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db = database;
  var thingsCollection = db.collection('things');
  var findString = '{"name":"Modular Structure"}';
  var o = JSON.parse(findString);
  console.log(o);
  thingsCollection.find(o).toArray(function(err, docs) {
    console.log(docs.length);
    console.dir(docs)
  }); 
});

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;

socketio.on('connection', function (socket) {
	console.log('socketio connection');
	// setInterval(function () {
	// 	console.log('emitting...');
	// 	socket.emit('news', { hello: 'world' });
	// }, 3000);
});


// Close connections
// _db.close();
