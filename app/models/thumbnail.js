var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    data:   { type: Buffer },
    contentType:   { type: String }
},{
    timestamps: true
});

schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Thumbnail', schema);
