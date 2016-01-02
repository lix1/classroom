var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    _id:        {   type: String, lowercase: true, trim: true,
                    validate: {
                        validator: function(v) {
                            return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.edu$/.test(v);
                        },
                        message: '{VALUE} is not a valid university email!'
                    }},
    firstName:     { type: String, trim: true, required : true },
    lastName:      { type: String, trim: true, required : true },
    birthday:       { type: Date },
    gender:         { type: String, enum: ['Female', 'Male']},
    major:          [ { type: String, trim: true, uppercase: true }],
    minor:          [ { type: String, trim: true, uppercase: true }],
    _university:      { type: Schema.Types.ObjectId, ref: 'University' },
    vatus:          { type: String },
    schedule:   [{
        courseId: { type: String, trim: true, uppercase: true },
        name: { type: String, trim: true },
        building: { type: String, trim: true },
        day: [ { type: String, trim: true }],
        endTime: { type: String, trim: true },
        professor: { type: String, trim: true },
        room: { type: String, trim: true },
        startTime: { type: String, trim: true }
    }],
    createdTS:     { type: Date, default: Date.now },
    updatedTS:     { type: Date, default: Date.now }
});
schema.virtual('email').get(function() {
    return this._id;
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserProfile', schema);
