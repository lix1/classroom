var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    _userProfile:    { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    email:        {   type: String, lowercase: true, trim: true,
                    validate: {
                        validator: function(v) {
                            return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.edu$/.test(v);
                        },
                        message: '{VALUE} is not a valid university email!'
                    }},
    lastLoginTS: { type: Date },
    password:   { type: String, required : true },
    isVerified: {type : Boolean, default : false},
    _secRoles:  [{type: Schema.Types.ObjectId, ref: 'SecurityRole' }],
    updatedAt: { type: Date, default: Date.now }
});

schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', schema);
