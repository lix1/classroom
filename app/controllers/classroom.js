var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication'),
    CourseModel = require('../models').Course,
    UniversityModel = require('../models').University,
  ClassroomModel = require('../models').Classroom;

module.exports = {
  findByCourse:function(req, res) {
    var year = req.params.year
        , semester = req.params.semester
        , courseId = req.params.courseId;
    var decoded = auth.decodeToken(req,function(decoded) {
      ClassroomModel.findOne({'year' : year, 'semester' : { $regex : new RegExp('^'+semester+'$', "i") }, 'courseId' : { $regex : new RegExp('^'+courseId+'$', "i") }})
          .populate('_members', '_id firstName lastName')
            .populate('_parent', '_id')
          .exec(function (err, doc) {
            if (err){
              res.json(500, {error: "Failed to query classroom for " + courseId});
            } else if (!doc) {
              res.json(404, {error: "Classroom not found"});
              //var emailRegex = /^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.edu)$/g;
              //var matches = emailRegex.exec(decoded.id);
              //var domain = matches[1];
              //UniversityModel.findOne({'domain': domain, 'courses.courseId': courseId}, {'courses.$': 1}, function (err, university) {
              //  if (err) {
              //    res.status(500).json({error: "Failed to query university with domain "+domain+" : " + err});
              //  } else if (!university) {
              //    res.status(500).json({error: "University with domain "+domain+" not found"});
              //  }else {
              //    var courseName = university.courses[0].name;
              //    var newClassroom = new ClassroomModel({
              //      courseId: courseId,
              //      name: courseName,
              //      semester: semester,
              //      year: year
              //    });
              //    newClassroom.save(function(err, classroom) {
              //      if (err) {
              //        res.json(500, {error: "Error creating new classroom: " + err.message});
              //      }
              //      res.status(201).json(classroom);
              //    });
              //  }
              //});
            } else {
              res.status(200).json(doc);
            }

          })
    })

  },
  findBySlug:function(req, res) {
    var slug = req.params.slug;
    ClassroomModel.findOne({'slug' : { $regex : new RegExp('^'+slug+'$', "i") }})
        .populate('_members', '_id firstName lastName')
        .populate('_parent', '_id')
        .exec(function (err, doc) {
          if (err){
            res.json(500, {error: "Failed to query classroom for " + courseId});
          } else if (!doc) {
            res.json(404, {error: "Classroom not found"});
          } else {
            res.status(200).json(doc);
          }

        })

  },
  update:function(req, res) {
    ClassroomModel.findByIdAndUpdate("56885dd41109bd1a3c4539de", { $set: { slug: 'Spring-2016-CMSC122' }}, function (err, classroom) {
      if (err) res.json(500, {error: "Failed to update classroom"});
      res.status(200).json(classroom);
    });
  }
};
