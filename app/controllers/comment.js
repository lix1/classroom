var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication'),
    PostModel = require('../models').Post,
  CommentModel = require('../models').Comment;
var async = require('async');

module.exports = {
  findByPost: function(req, res) {
    var decoded = auth.decodeToken(req,function(decoded) {
      CommentModel.find({_post: req.params.postId, _university: decoded.university})
          .populate('createdBy', 'email firstName lastName')
          .sort( [['_id', -1]] )
          .exec(function (err, docs) {
            if (err) {
              res.status(500).json({ error: 'Failed to query comments: ' + err });
            } else if(!docs) {
              res.status(404).json({ error: 'No comments found'});
            } else {
              res.status(200).json(docs);
            }
          });
    });

  },
  create: function(req, res) {
    async.waterfall([
      function(callback){
        if(req.body.postId && req.body.content) {
          var decoded = auth.decodeToken(req,function(decoded) {
            var comment = new CommentModel({
              _post:    req.body.postId,
              _parent: req.body.parentId,
              _university: decoded.university,
              content:  req.body.content,
              anonymous:  req.body.anonymous,
              createdBy:  decoded.id,
              updatedBy:  decoded.id
            });
            comment.save(function (err, doc) {
              if (err) {
                callback(new Error("Failed to create new comment"), 500)
              } else {
                callback(null, doc.toJSON());

              }
            });
          })
        } else {
          callback(new Error("Invalid request: missing required field(s)"), 500)
        }
      },
      function(comment, callback){
        PostModel.update({_id:req.body.postId},{ $inc: { replyCount: 1 }}).exec();
        callback(null, comment);
      }
    ], function (err, result) {
      if(err){
        res.status(result).json({error: err});
      }
      res.status(201).json(result);
    });



  }
};
