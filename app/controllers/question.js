var fs = require('fs'),
    path = require('path'),
    auth = require('./authentication'),
    QuestionModel = require('../models').Question;

module.exports = {
  find:function(req, res) {
    if(req.params.id) {
      QuestionModel.findOne({_id: req.params.id}, function (err, course) {
        if (err) {
          res.json(500, {error: "Error querying question with id " + req.params.id + ": " + err.message});
        }
        res.json(200, course);
      });

    } else {
      res.json(400, { error: 'Invalid request' });
    }
  },
  findByCourse:function(courseId, success, err) {
    QuestionModel.find({courseId: courseId}, function (err, list) {
      if (err) {
        err(err);
      }
      success(list);
    });
  },
  create: function(req, res) {
    if(req.body.title && req.body.details && req.body.courseId) {
      // todo: validate courseId
      var decoded = auth.decodeToken(req,function(decoded){
        var newQuestion = new QuestionModel({
          title: req.body.title,
          details: req.body.details,
          courseId: req.body.courseId,
          authorId: decoded.id
        });
        newQuestion.save(function(err, newCourse) {
          if (err) {
            // error handling
            res.json(500, {error: "Error creating new question: " + err.message});
          }
          console.log('Successfully added new question ' + newQuestion._id);
          res.json(201, newCourse)
        });

      }, function(err){
        res.json(500, { error: 'Failed to decoe token: ' + err });
      });
    } else {
      res.json(500, { error: 'Invalid request: missing required field(s)' });
    }
  }
};
