var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var scheduleSchema = new Schema({
    courseId: { type: String, trim: true, uppercase: true, required: true},
    name: { type: String, trim: true, required: true },
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall', 'Winter'], required: true},
    year: { type: Number, min: 2015, max: 2016, required: true },
    building: { type: String, trim: true },
    day: [ { type: String, trim: true }],
    endTime: { type: String, trim: true },
    professor: { type: String, trim: true },
    room: { type: String, trim: true },
    startTime: { type: String, trim: true }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

var schema = new Schema({
    email:        {type: String, lowercase: true, trim: true,
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
    major:          [ { type: String, trim: true }],
    minor:          [ { type: String, trim: true }],
    _university:      { type: Schema.Types.ObjectId, ref: 'University' },
    vatus:          { type: String },
    schedule:       [ scheduleSchema ],
    _classrooms:     [{ type: Schema.Types.ObjectId, ref: 'Classroom' }],
    updatedAt:     { type: Date, default: Date.now }
});


schema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});

scheduleSchema.virtual('slug').get(function() {
     return this.semester + '-' + this.year + '-' + this.courseId;
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserProfile', schema);
