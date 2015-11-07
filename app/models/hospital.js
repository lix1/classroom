var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path');

var HospitalSchema = new Schema({
  name:       { type: String, trim: true },
  name_en:    { type: String, trim: true },
  introduction:    { type: String },
  address:    { type: String, trim: true },
  homepage:   { type: String, validate: /[a-z]/, trim: true },
  ranking:    { type: Number, min: 1, max: 10}
});

module.exports = mongoose.model('Hospital', HospitalSchema);

//   /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
