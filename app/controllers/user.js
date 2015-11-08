var fs = require('fs'),
  path = require('path'),
  UserModel = require('../models').User;

module.exports = {
  getAll: function(req, res) {
    UserModel.find({}, function(err, docs) {
      if (err) {
        res.json(500, {error: "Error getting all users: " + err.message});
      }
      res.json(200, docs);
    });
  },
  getById: function(id,callback,err) {
    UserModel.find({_id: id}, function(err, user) {
      if (err) {
        err(err);
      }
      var userResp={};
      userResp.userId=id;
      userResp.userName=user.userName;
      userResp.email=user.email;

      callback(userResp)
    });
  }
};
