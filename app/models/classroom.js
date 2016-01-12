var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var eventSchema = new Schema({
    title: { type: String, trim: true, required: true },
    note: { type: String, trim: true },
    type: { type: String, enum: ['Assignment', 'Project', 'Quiz', 'Exam', 'Other'], default: 'Other'},
    startTime:     { type: Date },
    endTime:     { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' }
},{
    timestamps: true
});

eventSchema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});


var schema = new Schema({
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall', 'Winter']},
    year: { type: Number, min: 2015, max: 2016},
    slug:   { type: String, trim: true },
    calendar:       [ eventSchema ],
    _members:  [{type: Schema.Types.ObjectId, ref: 'UserProfile' }],
    _parent: { type: Schema.Types.ObjectId, ref: 'Classroom' },
    _university: { type: Schema.Types.ObjectId, ref: 'University', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
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
    if(!this._parent){
        this.slug = this.semester.toLowerCase() + '-' + this.year + '-' + this.name.toLowerCase();
    } else {
        this.slug += '-' + slugify(this.name);
    }
    next();
});
schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Classroom', schema);
