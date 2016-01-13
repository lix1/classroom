var fs = require('fs'),
    path = require('path'),
    UserModel = require('../models').User,
    UniversityModel = require('../models').University,
    UserProfileModel = require('../models').UserProfile;
var async = require('async');
var jwt = require('jsonwebtoken');

var secret = 'lavender';

module.exports = {
  login: function(req, res) {
    if(req.body.email && req.body.password) {
      UserModel.getAuthenticated(req.body.email,req.body.password, function(err, user, reason){
        if (err){
          return res.status(401).json({error: "Invalid user name or password"});
        }
        if (user) {
          var token = jwt.sign({id:user._userProfile._id, isVerified:user.isVerified, university:user._userProfile._university,
            email:user.email, firstName:user._userProfile.firstName, lastName:user._userProfile.lastName}, secret, {
            expiresInMinutes: 2880 // expires in 24 hours
          });
          res.json({
            success: true,
            message: 'Authenticated!',
            token: token
          });
        } else {
          var reasons = UserModel.failedLogin;
          switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
              // note: these cases are usually treated the same - don't tell
              // the user *why* the login failed, only that it did
              res.status(401).json({error: "Invalid user name or password"});
              break;
            case reasons.MAX_ATTEMPTS:
              // send email or otherwise notify user that account is
              // temporarily locked
              res.status(401).json({error: "You exceeded the maximum allowed number of login attempts. Account is temporarily locked. Please try again in 15 minutes."});
              break;
          }
        }


      })
      //UserModel.findOne({email: req.body.email, password: req.body.password})
      //    .populate('_userProfile', '_id firstName lastName _university')
      //    .exec(function (err, user) {
      //      if (err){
      //        res.status(401).json({error: "Error occurred during authentication process"});
      //      } else if (!user) {
      //        res.status(401).json({error: "Authentication failed. Invalid user name or password"});
      //      } else {
      //        console.log(user)
      //        var token = jwt.sign({id:user._userProfile._id, isVerified:user.isVerified, university:user._userProfile._university,
      //                              email:user.email, firstName:user._userProfile.firstName, lastName:user._userProfile.lastName}, secret, {
      //          expiresInMinutes: 2880 // expires in 24 hours
      //        });
      //        // return the information including token as JSON
      //        res.json({
      //          success: true,
      //          message: 'Authenticated!',
      //          token: token
      //        });
      //      }
      //
      //    })
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  },
  signup: function(req, res) {
    if (req.body.email && req.body.password && req.body.firstName && req.body.lastName) {
      async.waterfall([
        function(callback) {
          var emailRegex = /^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.edu)$/g;
          var matches = emailRegex.exec(req.body.email);
          if(matches==null||matches.length==0){
            return callback(new Error("Invalid university email address: " + req.body.email), 400)
          } else {
            var domain = matches[1];
            UniversityModel.findOne({domain: domain}, function (err, university) {
              if (err) {
                return callback(new Error("Failed to query university for " + domain), 500)
              } else if(!university) {
                return callback(new Error("University with domain "+domain+" not found"), 404)
              } else {
                callback(null, university);
              }
            });
          }
        },
        function(university, callback) {
          // todo remove this later
          UserModel.find({email:req.body.email}).remove().exec();
          UserProfileModel.find({_id:req.body.email}).remove().exec();

          var newUser = new UserModel({
            email:        req.body.email,
            password:   req.body.password
          });
          newUser.save(function(err, user) {
            console.log(err)
            console.log(user)

            if (err) {
              return callback(new Error("Error occurred during registration"), 500);
            }
            callback(null, user, university)
          });
        },
        function(user, university, callback) {
          var userProf = new UserProfileModel({
            email:        req.body.email,
            firstName:  req.body.firstName,
            lastName:   req.body.lastName,
            major:      [],
            minor:      [],
            _university:   university._id
          });
          userProf.save(function (err1, profile) {
            if (err1) {
              console.log('Failed to save user profile');
              user.remove(function (err2, product) {
                if (err2) {
                  console.log('Failed to remove user profile: ' + err2);
                }
                return callback(new Error("Error occurred during registration: failed to create user profile"), 500);
              })
            }
            callback(null, user, profile, university);
          });
        },
        function(user, profile, university, callback) {
          user._userProfile = profile._id;
          user.save(function(err) {
            if(err) {
              return callback(new Error("Error occurred during registration: failed to associate user profile"), 500);
            }
            callback(null, user, profile, university);
          });
        },
        function(user, profile, university, callback) {
          var token = jwt.sign({id:profile._id, isVerified:user.isVerified, university:university._id,
            email:user.email, firstName:profile.firstName, lastName:profile.lastName}, secret, {
            expiresInMinutes: 2880 // expires in 24 hours
          });
          // return the information including token as JSON
          callback(null, token);
        }
      ], function (err, result) {
        if(err){
          return res.status(result).json({error: err});
        }
        res.status(201).json({
          success: true,
          message: 'Authenticated!',
          token: result
        });

      });
    }
  },
  verifyToken: function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers.authorization;
    // decode token
    if (token) {
      console.log(req.headers.authorization)
      var parts = token.split(' ');
      if(parts.length==2){
        token=parts[1];
      }
      // verifies secret and checks exp
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          return res.status(401).send({ success: false, message: 'Failed to authenticate token: '+err });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {
      // if there is no token
      // return an error
      return res.status(401).send({
        success: false,
        message: 'No token provided.'
      });

    }
  },
  decodeToken: function(req, success, error) {
    var token = req.body.token || req.query.token || req.headers.authorization;
    if (token) {
      var parts = token.split(' ');
      if(parts.length==2){
        token=parts[1];
      }

      // verifies secret and checks exp
      jwt.verify(token, secret, function(err, decoded) {
        if (!err) {
          success(decoded);
        } else {
          error(err);
        }
      });

    } else {
      error('No token provided');
    }

  }
};
