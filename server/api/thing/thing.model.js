'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
}, { capped: { size: 1024, max: 1000, autoIndexId: true } });

module.exports = mongoose.model('Thing', ThingSchema);