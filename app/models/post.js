var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Question', new Schema({
    title:          { type: String, trim: true },
    content:   { type: String, trim: true },
    tags:   [{ type: String, trim: true }],
    forumId: { type: Schema.Types.ObjectId },
    topic: { type: String, enum: ['classroom']},
    slug:   { type: String, trim: true },
    voteCount:     { type: Number, default: 0 },
    viewCount:     { type: Number, default: 0 },
    replyCount:     { type: Number, default: 0 },
    createdTS:     { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedTS: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' }
}));
