var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    _post: { type: Schema.Types.ObjectId, ref: 'Post' },
    _parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
    content:   { type: String, trim: true, required: true },
    voteCount:     { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedAt: { type: Date, default: Date.now },
    anonymous: { type: Boolean, default: false }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

schema.virtual('createdAt').get(function() {
    return this._id.getTimestamp();
});
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Comment', schema);
