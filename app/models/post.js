var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    title:          { type: String, trim: true, required: true },
    content:   { type: String, trim: true, required: true },
    tags:   [{ type: String, trim: true }],
    forumSlug: { type: String, trim: true, required: true },
    forumRef: { type: String, enum: ['Classroom'], required: true},
    slug:   { type: String, trim: true },
    uid:   { type: String, trim: true },
    anonymous: { type: Boolean, default: false },
    voteCount:     { type: Number, default: 0 },
    viewCount:     { type: Number, default: 0 },
    replyCount:     { type: Number, default: 0 },
    _university: { type: Schema.Types.ObjectId, ref: 'University' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedAt: { type: Date, default: Date.now }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

function slugify(text) {

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

schema.pre('save', function (next) {
    this.slug = slugify(this.title);
    this.uid = this._id.toString().substring(1,8)+this._id.toString().substring(22);
    next();
});

schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});


schema.virtual('url').get(function() {
    var timestamp = this.id.substring(0,8);
    return '/' + this.forumSlug + '/' + this.uid + '/' + this.slug;
});
schema.virtual('createdAt').get(function() {
    return this._id.getTimestamp();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Post', schema);
