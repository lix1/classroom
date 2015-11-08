var fs = require('fs'),
  path = require('path'),
  UserModel = require('../models').User;
var jwt = require('jsonwebtoken');

var secret = 'lavender';

module.exports = {
  login: function(req, res) {
    if(req.body.email && req.body.password) {
      UserModel.findOne({email: req.body.email, password: req.body.password}, function (err, user) {
        if (err) {
          res.json(401, {error: "Error occurred during authentication process: " + err.message});
        }
        if (user) {
          var token = jwt.sign({email:user.email,userName:user.userName,id:user._id}, secret, {
            expiresInMinutes: 2880 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        } else {
          res.json(401, {error: "Authentication failed. Invalid user name or password"});
        }
      });
    } else {
      res.json(400, { error: 'Invalid request' });
    }
  },
  signup: function(req, res) {
    // insert the new item into the collection (validate first)
    if(req.body.name && req.body.email && req.body.password) {
      // validate email doesn't exist
      UserModel.findOne({email: req.body.email}, function (err, user) {
        if (err) {
          // error
        }
        if (user) {
          res.json(400, {error: "Email "+req.body.email+" already exists." + err.message});
        } else {
          var newUser = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          newUser.save(function(err, user) {
            if (err) {
              res.json(500, {error: "Error occurred during registration: " + err.message});
            }
            console.log('Successfully registered ' + req.body.email);
            res.json(201, "Successfully registered");
          });
        }
      });
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

  },
  getAll: function(req, res) {
    UserModel.find({}, function(err, docs) {
      if (err) {
        res.json(500, {error: "Error getting all users: " + err.message});
      }
      res.json(200, docs);
    });
  }
};
