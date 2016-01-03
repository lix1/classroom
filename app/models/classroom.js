var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Classroom', new Schema({
    courseId: { type: String, trim: true, uppercase: true, required: true },
    name: { type: String, trim: true, required: true },
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall', 'Winter'], required: true},
    year: { type: Number, min: 2015, max: 2016, required: true },
    _members:  [{type: Schema.Types.ObjectId, ref: 'UserProfile' }],
    _parent: { type: Schema.Types.ObjectId, ref: 'Classroom' },
    createdTS:     { type: Date, default: Date.now },
    updatedTS:     { type: Date, default: Date.now }
}));
