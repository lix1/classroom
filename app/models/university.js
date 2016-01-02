var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

// set up a mongoose model and pass it using module.exports
var schemaOptions = {
    toObject: {
        virtuals: true
    }
    ,toJSON: {
        virtuals: true
    }
};

module.exports = mongoose.model('University', new Schema({
    name:       { type: String, trim: true },
    webAddress: { type: String, trim: true },
    domain:     { type: String, trim: true },
    courses:   [{
        courseId: { type: String, trim: true, uppercase: true },
        name: { type: String, trim: true }
    }]

},schemaOptions));
