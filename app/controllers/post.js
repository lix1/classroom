var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication'),
  PostModel = require('../models').Post,
    CommentModel = require('../models').Comment;
var async = require('async');

module.exports = {
  findBySlug: function(req, res) {
    async.waterfall([
      function(callback) {
        PostModel.findOne({'forumRef' : { $regex : new RegExp('^'+req.params.forumRef+'$', "i") }, 'forumSlug' : { $regex : new RegExp('^'+req.params.forumSlug+'$', "i") }, 'slug' : { $regex : new RegExp('^'+req.params.slug+'$', "i") }, 'uid' : req.params.uid})
            .populate('createdBy', '_id firstName lastName')
            .exec(function (err, post) {
              if (err) {
                return callback(new Error("Failed to query post"), 500);
              } else if(!post) {
                return callback(new Error("Post not found"), 404);
              } else {
                callback(null, post.toJSON());
              }
            });
      },
      function(post, callback) {
        CommentModel.find({_post: post._id})
            .populate('createdBy', 'email firstName lastName')
            .sort( [['_id', -1]] )
            .exec(function (err, comments) {
              if (err) {
                return callback(new Error("Failed to query comments"), 500);
              } else if(!comments) {
                return callback(new Error("No comments found"), 404);
              } else {
                callback(null, post, comments);
              }
            });
      },
      function(post, comments, callback) {
        post.replies = comments;
        callback(null, post);
      }
    ], function (err, result) {
      if(err){
        res.status(result).json({error: err});
      }
      res.status(200).json(result);
    });
  },
  findByForum: function(req, res) {
    var model = require('../models')[req.params.forumRef];
    model.findOne({slug: req.params.forumSlug}, function (err, forum) {
      if (err) {
        res.status(500).json({ error: 'Failed to query ' + req.params.forumRef });
      } else if(!forum) {
        res.status(500).json({ error: req.params.forumRef + ' not found'});
      } else {
        PostModel.find({'forumRef' : req.params.forumRef, 'forumSlug' : { $regex : new RegExp('^'+req.params.forumSlug+'$', "i") }})
            .populate('createdBy', 'email firstName lastName')
            .sort( [['_id', -1]] )
            .exec(function (err, doc) {
              if (err) {
                res.status(500).json({ error: 'Failed to query posts: ' + err });
              } else if(!doc) {
                res.status(404).json({ error: 'No posts found'});
              } else {
                res.status(200).json(doc);
              }
            });
      }
    });
  },
  create: function(req, res) {
    if(req.body.title && req.body.content && req.body.forumId && req.body.forumRef) {
      var decoded = auth.decodeToken(req,function(decoded) {
        var model = require('../models')[req.body.forumRef];
        model.findOne({_id: req.body.forumId}, function (err, forum) {
          if (err) {
            res.status(500).json({ error: 'Failed to query ' + req.body.forumRef });
          } else if(!forum) {
            res.status(500).json({ error: req.body.forumRef + ' not found'});
          } else {
            var post = new PostModel({
              title:    req.body.title,
              content:  req.body.content,
              tags:  req.body.tags,
              forumSlug:  forum.slug,
              forumRef:  req.body.forumRef,
              anonymous:  req.body.anonymous,
              createdBy:  decoded.id,
              updatedBy:  decoded.id
            });
            post.save(function (err, doc) {
              if (err) res.status(500).json({ error: 'Failed to create new post: ' + err });
              res.status(201).json(doc)
            });
          }
        });
      })
    } else {
      res.status(500).json({ error: 'Invalid request: missing required field(s)' });
    }
  }
};
