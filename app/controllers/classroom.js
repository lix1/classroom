var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication'),
    UniversityModel = require('../models').University,
  ClassroomModel = require('../models').Classroom;
var async = require('async');

var isValidSlug = function(slug){
    var validSlug = /^([a-z]+-[0-9]{4}-[a-z0-9]+)$/.test(slug.toLowerCase());
    return validSlug;
};

module.exports = {
  findBySlug:function(req, res) {
      var slug = req.params.slug.toLowerCase();;
      async.waterfall([
          function(callback){
              var decoded = auth.decodeToken(req,function(decoded) {
                  ClassroomModel.findOne({'slug' : { $regex : new RegExp('^'+slug+'$', "i")}, '_university':decoded.university })
                      .populate('_members', '_id firstName lastName')
                      .populate('_parent', '_id slug name')
                      .exec(function (err, doc) {
                          if (err){
                              callback(new Error("Failed to query classroom for " + slug), 500);
                          } else if (!doc) {
                              var error={};
                              if(isValidSlug(slug)) {
                                  var parts = slug.split("-");
                                  var year = parts[1];
                                  var currentYear = new Date().getFullYear();
                                  if(year != currentYear) {
                                      return callback(new Error("Classroom not found"), 404);
                                  } else {
                                      var semester = parts[0].toLowerCase().replace(/^(.)/g, function($1) { return $1.toUpperCase(); })
                                      var courseId = parts[2];
                                      UniversityModel.findOne({_id: decoded.university, 'courses.courseId': { $regex : new RegExp('^'+courseId+'$', "i")}}, {'courses.$': 1}, function (err, university) {
                                          if (err) {
                                              return callback(new Error("Failed to query university"), 500);
                                          } else if (!university) {
                                              return callback(new Error("Course "+courseId+" not found"), 404);
                                          } else {
                                              var courseName = university.courses[0].name;
                                              var newClassroom = new ClassroomModel({
                                                  name: courseId,
                                                  description: courseName,
                                                  semester: semester,
                                                  year: year,
                                                  _university: university._id,
                                                  createdBy:decoded.id
                                              });
                                              newClassroom.save(function(err, classroom) {
                                                  if (err) {
                                                      console.log(err)
                                                      return callback(new Error("Failed to create new classroom"), 500);
                                                  } else {

                                                  }
                                                  callback(null, classroom.toJSON());
                                              });
                                          }
                                      });
                                  }
                              } else {
                                  callback(new Error("Classroom "+slug+" not found"), 404);
                              }
                          } else {
                              callback(null, doc.toJSON());
                          }
                      })
              }, function(err){
                  callback(new Error("Invalid token"), 401);
              });
          },
          function(classroom, callback){
              if(classroom._parent!=null){
                  callback(null, classroom);
              } else {
                  // find groups
                  ClassroomModel.find({'_parent':classroom._id }, '_id slug name description')
                      .exec(function (err, docs) {
                          if (!err && docs){
                              classroom.groups=docs;
                          }
                          callback(null, classroom);
                      })
              }
          }
      ], function (err, result) {
          if(err){
              res.status(result).json(err);
          }
          res.status(200).json(result);
      });

  },
    update:function(req, res) {
        ClassroomModel.findByIdAndUpdate("56885dd41109bd1a3c4539de", { $set: { slug: 'Spring-2016-CMSC122' }}, function (err, classroom) {
            if (err) res.json(500, {error: "Failed to update classroom"});
            res.status(200).json(classroom);
        });
    },
    create:function(req, res) {
        //todo check for unique name
        var decoded = auth.decodeToken(req, function (decoded) {
            if(req.body.slug!=null){
                var slug = req.body.slug.toLowerCase();
                if(isValidSlug(slug)){
                    var parts = slug.split("-");
                    var year = parts[1];

                    var currentYear = new Date().getFullYear();
                    var nextYear = currentYear+1;
                    if(year != currentYear && year != nextYear ) {
                        res.status(500).json({message: "Sorry, we only create classroom for " + currentYear + " and " + nextYear + " at this time"});
                    } else {
                        var semester = parts[0].toLowerCase().replace(/^(.)/g, function($1) { return $1.toUpperCase(); })
                        var courseId = parts[2];
                        UniversityModel.findOne({_id: decoded.university, 'courses.courseId': { $regex : new RegExp('^'+courseId+'$', "i")}}, {'courses.$': 1}, function (err, university) {
                            if (err) {
                                res.status(500).json({message: "Failed to query university"});
                            } else if (!university) {
                                res.status(404).json({message: "Course "+courseId+" not found"});
                            }else {
                                var courseName = university.courses[0].name;
                                var newClassroom = new ClassroomModel({
                                    courseId: courseId,
                                    name: courseName,
                                    semester: semester,
                                    year: year,
                                    _university: university._id,
                                    createdBy:decoded.id
                                });
                                newClassroom.save(function(err, classroom) {
                                    if (err) {
                                        console.log(err)
                                        res.status(500).json({message: "Failed to create new classroom"});
                                    }
                                    res.status(201).json(classroom);
                                });
                            }
                        });
                    }
                }
            } else {
                async.waterfall([
                    function(callback){
                        ClassroomModel.findOne({_id : req.body.parentId})
                            .exec(function (err, doc) {
                                if (err){
                                    callback(new Error("Failed to query classroom for " + slug), 500);
                                } else if (!doc) {
                                    callback(new Error("Classroom " + slug + " not found"), 404);
                                } else {
                                    callback(null, doc);
                                }
                            })
                    },
                    function(parent, callback){
                        if(parent._parent!=null){
                            return callback(new Error("Can't add group to " + slug), 500);
                        } else {
                            auth.decodeToken(req,function(decoded) {
                                var newClassroom = new ClassroomModel({
                                    name: req.body.group.name,
                                    description: req.body.group.description,
                                    slug: parent.slug,
                                    _parent:parent._id,
                                    _university: parent._university,
                                    createdBy:decoded.id
                                });
                                newClassroom.save(function(err, classroom) {
                                    if (err) {
                                        console.log(err)
                                        callback(new Error("Failed to create new group for " + parent.slug), 500);
                                    } else {
                                        callback(null, classroom);
                                    }
                                });
                            }, function(err){
                                callback(new Error("Invalid token"), 401);
                            });
                        }
                    }
                ], function (err, result) {
                    if(err){
                        res.status(result).json(err);
                    }
                    res.status(201).json(result);
                });
            }
        });
    },
    delete:function(req, res) {

    },
    getEventsByClassroom:function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            var slug = req.params.slug;
            ClassroomModel.findOne({'slug' : { $regex : new RegExp('^'+slug+'$', "i")}, '_university':decoded.university })
                .populate('_parent', '_id slug')
                .exec(function (err, doc) {
                    if (err){
                        res.status(500).json({error: "Failed to query classroom for " + slug});
                        console.log(err)
                    } else if (!doc) {
                        res.status(404).json({error: "Classroom not found"});
                    } else {
                        res.status(200).json(doc);
                    }
                })
        }, function(err){
            res.status(401).json({ error: 'Invalid token: ' + err });
        });
    },
    addEventToSchedule:function(req, res) {
        console.log("addEventToSchedule")
        var decoded = auth.decodeToken(req,function(decoded){
            ClassroomModel.update({ _id: req.body.classroomId},{ $push: { "calendar": {
                title: req.body.event.title,
                note: req.body.event.note,
                type: req.body.event.type,
                startTime: req.body.event.startTime,
                endTime: req.body.event.endTime,
                createdBy: decoded.id,
                updatedBy: decoded.id
            }}}, function(err, result){
                console.log(err)
                console.log(result)
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
            ClassroomModel.update({ _id: req.body.classroomId, "calendar._id": req.body.event.id},{ $set: { "calendar.$": {
                _id:        req.body.event.id,
                title:      req.body.event.title,
                note:       req.body.event.note,
                type:       req.body.event.type,
                startTime:  req.body.event.startTime,
                endTime:    req.body.event.endTime,
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
                    classroom.calendar.remove(req.params.calendarId);
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