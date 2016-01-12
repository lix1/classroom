var fs = require('fs'),
    path = require('path'),
    auth = require('./authentication'),
    UserProfileModel = require('../models').UserProfile,
    ThumbnailModel = require('../models').thumbnail,
    ClassroomModel = require('../models').Classroom,
    UniversityModel = require('../models').University;
var async = require('async');

module.exports = {
    getById: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            UserProfileModel
                .findOne({_id: decoded.id})
                .populate('_university', '_id name')
                .populate('_classrooms', '_id name slug _parent _parent.name')
                .exec(function (err, user) {
                    if (err) {
                        res.json(500, { error: 'Failed to find user profile'});
                    }
                    res.status(200).json(user.toJSON());
                });
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    update: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            var doc = {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
            UserProfileModel.findByIdAndUpdate(decoded.id, { $set: doc}, function (err, classroom) {
                if (err) res.json(500, {error: "Failed to update classroom"});
                res.status(200).json(classroom);
            });

        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    addCourseToSchedule: function(req, res) {
        auth.decodeToken(req,function(decoded){
            async.waterfall([
                function(callback){
                    // verify courseId and university
                    UniversityModel.findOne({_id: decoded.university, 'courses.courseId': { $regex : new RegExp('^'+req.body.courseId+'$', "i")}}, {'courses.$': 1}, function (err, university) {
                        if (err) {
                            callback(new Error('Failed to query university and course'), 500);
                        } else if (!university) {
                            callback(new Error("Course "+req.body.courseId+" not found"), 404);
                        }else {
                            var courseName = university.courses[0].name;
                            callback(null, courseName);

                        }
                    });

                },
                function(courseName, callback){
                    var schedule = { "schedule": {
                        courseId: req.body.courseId,
                        name: courseName,
                        semester: req.body.semester,
                        year: req.body.year,
                        building: req.body.building,
                        day: req.body.day,
                        startTime: req.body.startTime,
                        endTime: req.body.endTime,
                        professor: req.body.professor,
                        room: req.body.room
                    }};
                    UserProfileModel.findByIdAndUpdate(decoded.id, { $push: schedule}, {new:true}, function(err, profile){
                        if (err) {
                            callback(new Error('Failed to add course to schedule'), 500);
                        } else {
                            callback(null, profile);
                        }
                    })
                }
                //function(courseName, profile, callback){
                //    // add user to classroom member
                //    ClassroomModel.findOne({'name' : { $regex : new RegExp('^'+req.body.courseId+'$', "i")},
                //        'semester':req.body.semester,
                //        'year':req.body.year,
                //        '_university':decoded.university })
                //        .exec(function (err, doc) {
                //            if (err){
                //                callback(new Error("Failed to query classroom for " + req.body.courseId), 500);
                //            } else if (!doc) {
                //                var newClassroom = new ClassroomModel({
                //                    courseId: req.body.courseId,
                //                    name: courseName,
                //                    semester: req.body.semester,
                //                    year: req.body.year,
                //                    _members:[decoded.id],
                //                    _university: decoded.university,
                //                    createdBy:decoded.id
                //                });
                //                newClassroom.save(function(err, classroom) {
                //                    if (err) {
                //                        // todo log error
                //                    }
                //                    callback(null, profile);
                //                });
                //            } else {
                //                doc._members.$push(decoded.id);
                //                doc.save();
                //                callback(null, profile);
                //            }
                //        })
                //}
            ], function (err, result) {
                if (err) {
                    res.status(result).json({message: err});
                }
                res.status(201).json(result.toJSON());
            });
        }, function(err){
            res.json(401, { message: 'Invalid token: ' + err });
        });
    },
    updateCourseInSchedule: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            UserProfileModel.update({ _id: decoded.id, "schedule._id": req.body._id},{ $set: { "schedule.$": {
                _id: req.body._id,
                courseId: req.body.courseId,
                name: req.body.name,
                semester: req.body.semester,
                year: req.body.year,
                building: req.body.building,
                day: req.body.day,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                professor: req.body.professor,
                room: req.body.room
            }}}, function(err, result){
                if (err) {
                    res.json(500, { error: 'Failed to edit course '+req.body.courseId+' in schedule : ' + err });
                }
                UserProfileModel.findOne({_id: decoded.id}, 'schedule', function(err, doc){
                    res.status(200).json(doc);
                });
            })
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    deleteCourseById: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            UserProfileModel.update({_id: decoded.id}, { $pull: { "schedule": {_id:req.params.id}}}, function(err, numAffected){
                if (err) {
                    res.json(500, { error: 'Failed to delete course' + err });
                } else {
                    res.status(200).json({numAffected:numAffected});
                }
            })
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    joinClassroom: function(req, res) {
        auth.decodeToken(req,function(decoded){
            async.parallel({
                    updateClassroom: function(callback){
                        ClassroomModel.update({_id: req.body.classroomId}, { $addToSet: { "_members": decoded.id}}, function(err, numAffected){
                            if (err) {
                                callback(new Error('Failed to add user to classroom'));
                            } else {
                                callback(null, numAffected);
                            }
                        })
                    },
                    updateProfile: function(callback){
                        UserProfileModel.update({_id: decoded.id}, { $addToSet: { "_classrooms": req.body.classroomId}}, function(err, numAffected){
                            if (err) {
                                callback(new Error('Failed to add classroom to user groups'));
                            } else {
                                callback(null, numAffected);
                            }
                        })
                    }
                },
                function(err, results) {
                    if(err){
                        res.status(500).json({message:err});
                    } else {
                        res.status(200);
                    }
                });
        }, function(err){
            res.status(401).json({ error: 'Invalid token: ' + err });
        });
    },
    leaveClassroom: function(req, res) {
        auth.decodeToken(req,function(decoded){
            async.parallel({
                    updateClassroom: function(callback){
                        ClassroomModel.update(req.params.classroomId, { $pull: { "_members": decoded.id}}, function(err, numAffected){
                            if (err) {
                                callback(new Error('Failed to remove user from classroom'));
                            } else {
                                callback(null, numAffected);
                            }
                        })
                    },
                    updateProfile: function(callback){
                        UserProfileModel.update({_id:decoded.id},{$pull:{_classrooms:req.params.classroomId}}, function(err, numAffected){
                            if (err) {
                                callback(new Error('Failed to remove classroom from user groups'));
                            } else {
                                callback(null, numAffected);
                            }
                        })
                    }
                },
                function(err, results) {
                    if(err){
                        res.status(500).json({message:err});
                    } else {
                        res.status(200);
                    }
                });
        }, function(err){
            res.status(401).json({ error: 'Invalid token: ' + err });
        });
    },
    uploadThumbnail: function(req, res) {
        auth.decodeToken(req,function(decoded){
            var data = req.body.data.replace(/^\w+:\w+\/\w+;\w+,/, '')
            var buf = new Buffer(data, 'base64');
            var emailRegex = /\w+:(\w+\/\w+);base64/;
            var matches = emailRegex.exec(req.body.data);
            var contentType;
            if(matches!=null&&matches.length>0){
                contentType = matches[1];
            }
            var doc = {
                _id:        decoded.id,
                data:       buf,
                contentType:contentType
            };
            ThumbnailModel.update({ _id: decoded.id }, doc, { upsert: true }, function (err, raw) {
                if (err) {
                    return res.status(500).json({message:err});
                }
                res.status(200).json({message:'Thumbnail uploaded successfully'});
            });
        }, function(err){
            res.status(401).json({ error: 'Invalid token: ' + err });
        });
    },
    getThumbnail: function(req, res) {
        auth.decodeToken(req,function(decoded){
            var id=req.params.id;
            if(id==null){
                id=decoded.id;
            }
            ThumbnailModel
                .findOne({_id: id})
                .exec(function (err, thumbnail) {
                    if (err) {
                        res.json(500, { error: 'Failed to find thumbnail'});
                    } else if (!thumbnail){
                        res.json(404, { error: 'Thumbnail not found'});
                    } else {
                        var base64Image = thumbnail.data.toString('base64');
                        res.writeHead(200, {
                            'Content-Type': thumbnail.contentType
                        });
                        res.end(base64Image);
                    }
                });


        }, function(err){
            res.status(401).json({ error: 'Invalid token: ' + err });
        });
    }
};


