var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Answer', new Schema({
    questionId:          { type: String, trim: true },
    answer:          { type: String, trim: true },
    authorId:    { type: String, trim: true },
    date:     { type: Date, default: Date.now },
    comments: [{ comment: String,
                date: { type: Date, default: Date.now },
                authorId:   String
    }]

}));
