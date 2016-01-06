var fs = require('fs'),
    path = require('path'),
    auth = require('./authentication'),
    UserProfileModel = require('../models').UserProfile;
module.exports = {
  getById: function(req, res) {
    var decoded = auth.decodeToken(req,function(decoded){
      UserProfileModel
          .findOne({email: decoded.email})
          .populate('_university', '_id name')
          .exec(function (err, user) {
            if (err) {
              res.json(500, { error: 'Failed to find user profile for '+ decoded.id + ": " + err });
            }
            res.status(200).json(user.toJSON());
          });
    }, function(err){
      res.json(401, { error: 'Invalid token: ' + err });
    });
  },
    addCourseToSchedule: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            UserProfileModel.update({ email: decoded.email},{ $push: { "schedule": {
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
                    res.json(500, { error: 'Failed to add course to schedule : ' + err });
                }
                UserProfileModel.findOne({email: decoded.email}, 'schedule', function(err, doc){
                    res.status(200).json(doc);
                });
            })
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    updateCourseInSchedule: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            UserProfileModel.update({ "email": decoded.email, "schedule._id": req.body._id},{ $set: { "schedule.$": {
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

            UserProfileModel
                .findOne({email: decoded.email})
                .select()
                .exec(function(err, prof) {
                    if (err) return res.json(500, { error: 'Failed to query user profile for '+decoded.id+' : ' + err });
                    if (!prof) return res.json(500, { error: 'User profile for '+decoded.id+' not found'});
                    prof.schedule.remove(req.params.id);
                    prof.save(function(err, updProf) {
                        if (err) res.json(500, { error: 'Failed to remove course from schedule : ' + err });
                        res.status(200).json(updProf);

                    });
                });

        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    }
};


