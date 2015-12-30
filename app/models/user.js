var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    _id:        { type: String, lowercase: true, trim: true },
    last_login_ts: { type: Date },
    password:   { type: String, required : true },
    isVerified: {type : Boolean, default : false},
    sec_roles:  [{type: Schema.Types.ObjectId, ref: 'SecurityRole' }],
    created_ts: { type: Date, default: Date.now },
    updated_ts: { type: Date, default: Date.now }
});
schema.virtual('email').get(function() {
    return this._id;
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', schema);
