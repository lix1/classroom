var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var schema = new Schema({
    courseId: { type: String, trim: true, uppercase: true, required: true },
    name: { type: String, trim: true, required: true },
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall', 'Winter'], required: true},
    year: { type: Number, min: 2015, max: 2016, required: true },
    slug:   { type: String, trim: true },
    _members:  [{type: Schema.Types.ObjectId, ref: 'UserProfile' }],
    _parent: { type: Schema.Types.ObjectId, ref: 'Classroom' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedAt:     { type: Date, default: Date.now }
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
    this.slug = this.semester.toLowerCase() + '-' + this.year + '-' + this.courseId.toLowerCase();
    if(this.parent!=null){
        this.slug += '-' + slugify(this.name);
    }
    next();
});
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});

schema.virtual('createdAt').get(function() {
    return this._id.getTimestamp();
});


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Classroom', schema);
