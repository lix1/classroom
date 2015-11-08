var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Course', new Schema({
    title:          { type: String, trim: true },
    courseNumber:   { type: String, trim: true },
    description:    { type: String, trim: true },
    department:     { type: String, trim: true }
}));
