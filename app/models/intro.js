var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path');

var IntroSchema = new Schema({
  title:          { type: String, trim: true },
  description:    { type: String },
  index:          { type: Number, min: 1, max: 6}
});

module.exports = mongoose.model('Intro', IntroSchema);
