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
mongoose.connect(config.mongo.uri, config.mongo.options);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var db;
var thingsCollection;

// Connection URL
//var mongo_url = 'mongodb://localhost:27017/myproject';
MongoClient.connect(config.mongo.uri, function(err, database) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db = database;
  thingsCollection = db.collection('things');
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
//require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;

socketio.on('connection', function (socket) {
	console.log('socketio connection');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// Routes for search API
var router = express.Router();
var cursors = {};

router.get('/search', function(req, res) {
    var jsonString = req.query.json;
    var id = req.query.queryID;
    console.log("query string: " + jsonString + " queryID: " + id);
    var o = JSON.parse(jsonString);
    //console.log(o);
    thingsCollection.find(o).toArray(function(err, docs) {
    console.log("Found " + docs.length + " documents.");
    //console.dir(docs)
    res.json(docs);
  });     
});



router.get('/searchstream', function(req, res) {
    console.log('searchstream');
    var jsonString = req.query.json;
    var id = req.query.queryID;
    console.log("query string: " + jsonString + " queryID: " + id);
    var o = JSON.parse(jsonString);
    //console.log(o);
    
    var cursorOptions = {
      tailable: true,
      await_data: true,
      numberOfRetries: -1
    }

    var cursor = thingsCollection.find(o, cursorOptions)
      .sort({$natural: -1})
      .stream();
    var streamID = 'stream' + id;

    cursor.on('data', function (doc) {
      console.log('streaming to socketio...');
      console.log(doc);
      console.log(streamID);
      socketio.emit(streamID, doc);
    });
    cursors[streamID] = cursor;
    res.json({streamID:streamID}); 
});


app.use('/api/v1', router);
