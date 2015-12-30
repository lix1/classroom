var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    _id:            { type: String, lowercase: true, trim: true },
    first_name:     { type: String, trim: true, required : true },
    last_name:      { type: String, trim: true, required : true },
    birthday:       { type: Date },
    gender:         { type: String, enum: ['Female', 'Male']},
    major:          [ { type: String, trim: true, uppercase: true }],
    minor:          [ { type: String, trim: true, uppercase: true }],
    school_id:      { type: Schema.Types.ObjectId, ref: 'University' },
    work_interest:  { type: String },
    research_interest: { type: String },
    vatus:          { type: String },
    created_ts:     { type: Date, default: Date.now },
    updated_ts:     { type: Date, default: Date.now }
});
schema.virtual('email').get(function() {
    return this._id;
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserProfile', schema);
