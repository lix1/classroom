var fs = require('fs'),
  path = require('path'),
  CourseModel = require('../models').Course;

module.exports = {
  getAll: function(req, res) {
    CourseModel.find({}, function(err, docs) {
      if (err) {
        res.json(500, {error: "Error getting all courses: " + err.message});
      }
      res.json(200, docs);
    });
  },
  search:function(req, res) {
    if(req.query.id) {
      CourseModel.findOne({_id: req.query.id}, function (err, course) {
        if (err) {
          res.json(500, {error: "Error querying course with id " + req.query.id + ": " + err.message});
        }
        res.json(200, course);
      });

    } else if(req.query.courseNumber) {
      CourseModel.findOne({courseNumber: req.query.courseNumber}, function (err, course) {
        if (err) {
          res.json(500, {error: "Error querying course with course number " + req.query.courseNumber + ": " + err.message});
        }
        res.json(200, course);
      });

    }
  },
  create: function(req, res) {
    if(req.body.title && req.body.courseNumber && req.body.department) {
      // validate course doesn't exist
      CourseModel.findOne({courseNumber: req.body.courseNumber}, function (err, course) {
        if (err) {
          // error
        }
        if(course){
          res.json(500, {error: "Course with course number " + req.query.courseNumber + " already exists"});
        }
        var newCourse = new CourseModel({
          title: req.body.title,
          courseNumber: req.body.courseNumber,
          description: req.body.description,
          department: req.body.department
        });
        newCourse.save(function(err, newCourse) {
          if (err) {
            // error handling
            res.json(500, {error: "Error creating new course: " + err.message});
          }
          console.log('Successfully created new course ' + newCourse.courseNumber);
          res.json(201, newCourse)
        });
      });
    } else {
      res.json(500, { error: 'Invalid request: missing required field(s)' });
    }
  }
};
