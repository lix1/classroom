var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication'),
  CommentModel = require('../models').Comment;

module.exports = {
  findByPost: function(req, res) {
    CommentModel.find({_post: req.params.postId})
        .populate('createdBy', 'email firstName lastName')
        .sort( [['_id', -1]] )
        .exec(function (err, docs) {
          if (err) {
            res.status(500).json({ error: 'Failed to query comments: ' + err });
          } else if(!doc) {
            res.status(404).json({ error: 'No comments found'});
          } else {
            res.status(200).json(docs);
          }
        });
  },
  create: function(req, res) {
    if(req.body.postId && req.body.content) {
      var decoded = auth.decodeToken(req,function(decoded) {
        var comment = new CommentModel({
          _post:    req.body.postId,
          _parent: req.body.parentId,
          content:  req.body.content,
          anonymous:  req.body.anonymous,
          createdBy:  decoded.id,
          updatedBy:  decoded.id
        });
        comment.save(function (err, doc) {
          if (err) res.status(500).json({ error: 'Failed to create new comment: ' + err });
          res.status(201).json(doc.toJSON())
        });
      })
    } else {
      res.status(500).json({ error: 'Invalid request: missing required field(s)' });
    }
  }
};
