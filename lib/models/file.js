'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: String,
  path: String,
  mime: String,
  size: String,
}, {
  timestamps: true
})

module.exports = mongoose.model('File', fileSchema);
