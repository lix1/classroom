var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name:       { type: String, trim: true },
    email:       { type: String, trim: true },
    password:   { type: String }
}));