var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication'),
    CourseModel = require('../models').Course,
    UniversityModel = require('../models').University,
  ClassroomModel = require('../models').Classroom;
var async = require('async');

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

            } else {
              res.status(200).json(doc);
            }

          })
    })

  },
  findBySlug:function(req, res) {
    var slug = req.params.slug;
      var decoded = auth.decodeToken(req,function(decoded) {
          ClassroomModel.findOne({'slug' : { $regex : new RegExp('^'+slug+'$', "i"), _university: decoded.university}})
              .populate('_members', '_id firstName lastName')
              .populate('_parent', '_id slug')
              .exec(function (err, doc) {
                  if (err){
                      res.json(500, {error: "Failed to query classroom for " + slug});
                  } else if (!doc) {
                      res.json(404, {error: "Classroom not found"});
                  } else {
                      res.status(200).json(doc);
                  }

              })
      });


  },
    update:function(req, res) {
        ClassroomModel.findByIdAndUpdate("56885dd41109bd1a3c4539de", { $set: { slug: 'Spring-2016-CMSC122' }}, function (err, classroom) {
            if (err) res.json(500, {error: "Failed to update classroom"});
            res.status(200).json(classroom);
        });
    },
    create:function(req, res) {
        var decoded = auth.decodeToken(req, function (decoded) {
            var slug = req.params.slug.toLowerCase();
            var validSlug = /^([a-z]+-[0-9]{4}-[a-z0-9]+)$/.test(slug);
            if(validSlug){
                var parts = slug.split("-");
                var year = parts[1];

                var currentYear = new Date().getFullYear();
                var nextYear = currentYear+1;
                if(year != currentYear || year != nextYear ) {
                    res.status(500).json({error: "Sorry, we only create classroom for " + currentYear + " and " + nextYear + " at this time"});
                } else {
                    var semester = parts[0];
                    var courseId = parts[2];
                    UniversityModel.findOne({_id: decoded.university, 'courses.courseId': courseId}, {'courses.$': 1}, function (err, university) {
                        if (err) {
                            res.status(500).json({error: "Failed to query university"});
                        } else if (!university) {
                            res.status(500).json({error: "University not found"});
                        }else {
                            var courseName = university.courses[0].name;
                            var newClassroom = new ClassroomModel({
                                courseId: courseId,
                                name: courseName,
                                semester: semester,
                                year: year,
                                _university: university._id
                            });
                            newClassroom.save(function(err, classroom) {
                                if (err) {
                                    res.json(500, {error: "Failed to create new classroom"});
                                }
                                res.status(201).json(classroom);
                            });
                        }
                    });
                }
            }
        });
    },
    getEventsByClassroom:function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            var slug = req.params.slug;
            ClassroomModel.findOne({'slug' : { $regex : new RegExp('^'+slug+'$', "i"), _university: decoded.university}})
                .populate('_parent', '_id slug')
                .exec(function (err, doc) {
                    if (err){
                        res.json(500, {error: "Failed to query classroom for " + slug});
                    } else if (!doc) {
                        res.json(404, {error: "Classroom not found"});
                    } else {
                        res.status(200).json(doc);
                    }

                })
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    addEventToSchedule:function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            ClassroomModel.update({ _id: req.body.classroomId},{ $push: { "schedule": {
                title: req.body.schedule.title,
                note: req.body.schedule.note,
                type: req.body.schedule.type,
                startTime: req.body.schedule.startTime,
                endTime: req.body.schedule.endTime,
                createdBy: decoded.id,
                updatedBy: decoded.id
            }}}, function(err, result){
                if (err) {
                    res.json(500, { error: 'Failed to add event to schedule' });
                }
                res.status(201).json(result);
            })
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    updateEventInSchedule: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            var set = {};
            ClassroomModel.update({ _id: req.body.classroomId, "schedule._id": req.body.schedule.id},{ $set: { "schedule.$": {
                title:      req.body.schedule.title,
                note:       req.body.schedule.note,
                type:       req.body.schedule.type,
                startTime:  req.body.schedule.startTime,
                endTime:    req.body.schedule.endTime,
                updatedBy:  decoded.id
            }}}, function(err, numAffected){
                if (err) {
                    res.json(500, { error: 'Failed to edit course '+req.body.courseId+' in schedule : ' + err });
                }
                res.status(200).json({numAffected: numAffected});
            })
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    deleteCourseById: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            ClassroomModel
                .findOne({_id: req.body.classroomId})
                .select()
                .exec(function(err, classroom) {
                    if (err) return res.json(500, { error: 'Failed to query classroom' });
                    if (!classroom) return res.json(500, { error: 'Classroom not found'});
                    classroom.schedule.remove(req.params.scheduleId);
                    classroom.save(function(err, updClassroom) {
                        if (err) res.json(500, { error: 'Failed to remove event from schedule'});
                        res.status(200).json(updClassroom);
                    });
                });
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    }

};