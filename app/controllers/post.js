var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication'),
    CourseModel = require('../models').Course,
    UniversityModel = require('../models').University,
  ClassroomModel = require('../models').Classroom;

module.exports = {
  findById:function(req, res) {
    CourseModel.findOne({_id: id}, function (err, course) {
      if (err) {
        err(err);
      }
      callback(course);
    });
  },
  findByCourse:function(req, res) {
    var year = req.params.year
        , semester = req.params.semester
        , courseId = req.params.courseId;
    var decoded = auth.decodeToken(req,function(decoded) {
      ClassroomModel.findOne({'year' : year, 'semester' : semester, 'courseId' : courseId})
          .populate('_members', '_id firstName lastName')
          .populate('_parent', '_id')
          .exec(function (err, doc) {
            if (err){
              res.json(500, {error: "Failed to query classroom for " + courseId});
            } else if (!doc) {
              var emailRegex = /^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.edu)$/g;
              var matches = emailRegex.exec(decoded.id);
              var domain = matches[1];
              UniversityModel.findOne({'domain': domain, 'courses.courseId': courseId}, {'courses.$': 1}, function (err, university) {
                if (err) {
                  res.status(500).json({error: "Failed to query university with domain "+domain+" : " + err});
                } else if (!university) {
                  res.status(500).json({error: "University with domain "+domain+" not found"});
                }else {
                  var courseName = university.courses[0].name;
                  var newClassroom = new ClassroomModel({
                    courseId: courseId,
                    name: courseName,
                    semester: semester,
                    year: year
                  });
                  newClassroom.save(function(err, classroom) {
                    if (err) {
                      res.json(500, {error: "Error creating new classroom: " + err.message});
                    }
                    res.status(201).json(classroom);
                  });
                }
              });
            } else {
              res.status(200).json(doc);
            }

          })
    })

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
