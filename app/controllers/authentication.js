var fs = require('fs'),
    path = require('path'),
    UserModel = require('../models').User,
    UniversityModel = require('../models').University,
    UserProfileModel = require('../models').UserProfile;
var jwt = require('jsonwebtoken');

var secret = 'lavender';

module.exports = {
  login: function(req, res) {
    if(req.body.email && req.body.password) {
      UserModel.findOne({_id: req.body.email, password: req.body.password}, function (err, user) {
        if (err) {
          res.status(401).json({error: "Error occurred during authentication process: " + err.message});
        }
        if (user) {
          var token = jwt.sign({id:user._id}, secret, {
            expiresInMinutes: 2880 // expires in 24 hours
          });
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Authenticated!',
            token: token
          });
        } else {
          res.status(401).json({error: "Authentication failed. Invalid user name or password"});
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  },
  signup: function(req, res) {
    if(req.body.email && req.body.password && req.body.firstName && req.body.lastName ) {
      // get school_id from email
      var emailRegex = /^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.edu)$/g;
      var matches = emailRegex.exec(req.body.email);
      console.log(matches);
      if(matches==null||matches.length==0){
        res.status(400).json({error: "Invalid university email address: " + req.body.email});
      } else {
        var domain = matches[1];
        var errCount = 0;
        var succCount = 0;
        UniversityModel.findOne({domain: domain}, function (err, item) {
          if (err || item==null) {
            res.status(500).json({error: "University with domain "+domain+" not found"});

          } else {
            UserModel.find({_id:req.body.email}).remove().exec();
            UserProfileModel.find({_id:req.body.email}).remove().exec();
            var newUser = new UserModel({
              _id:        req.body.email,
              password:   req.body.password
            });
            newUser.save(function(err, user) {
              if (err) {
                res.status(500).json({error: "Error occurred during registration: " + err.message});
              }
              res.status(201).json("Successfully registered " + req.body.email);
            });
            var prof = new UserProfileModel({
              _id:        req.body.email,
              firstName:  req.body.firstName,
              lastName:   req.body.lastName,
              major:      [],
              minor:      [],
              _university:   item._id
            });
            prof.save(function (err, raw) {
              if (err) console.log('Failed to save user profile', raw);
              console.log('Saved user profile ', raw);
            });
          }
        });
      }
    } else {
      res.json(400, { error: 'Invalid request' });
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
