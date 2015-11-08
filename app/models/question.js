var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Question', new Schema({
    courseId:          { type: String, trim: true },
    title:          { type: String, trim: true },
    details:   { type: String, trim: true },
    authorId:    { type: String, trim: true },
    date:     { type: Date, default: Date.now }
}));
