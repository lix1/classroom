var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path');

var ProcessSchema = new Schema({
  title:          { type: String, trim: true },
  description:    { type: String },
  step:          { type: Number, min: 1}
});

module.exports = mongoose.model('Process', ProcessSchema);
