var fs = require('fs'),
    path = require('path'),
    auth = require('./authentication'),
    UniversityModel = require('../models').University,
    UserProfileModel = require('../models').UserProfile;
module.exports = {
  getById: function(req, res) {
    var decoded = auth.decodeToken(req,function(decoded){
      UserProfileModel
          .findOne({_id: decoded.id})
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
            UserProfileModel.update({ _id: decoded.id},{ $push: { "schedule": {
                courseId: req.body.courseId,
                name: req.body.name,
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
                UserProfileModel.findOne({_id: decoded.id}, 'schedule', function(err, doc){
                    res.status(200).json(doc);
                });
            })
        }, function(err){
            res.json(401, { error: 'Invalid token: ' + err });
        });
    },
    updateCourseInSchedule: function(req, res) {
        var decoded = auth.decodeToken(req,function(decoded){
            UserProfileModel.update({ "_id": decoded.id, "schedule._id": req.body._id},{ $set: { "schedule.$": {
                courseId: req.body.courseId,
                name: req.body.name,
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
    }
};


