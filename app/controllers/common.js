var fs = require('fs'),
  path = require('path'),
    auth = require('./authentication');

module.exports = {
  vote: function(req, res) {
    var modelName = req.params.model;
    var id = req.params.id;
    var modelFormatted = modelName.toLowerCase().replace(/^(.)/, function($1) { return $1.toLowerCase(); });
    var model = require('../models')[modelFormatted];
    if(model){
      model.update({_id:id},{ $inc: { voteCount: 1 }}, function (err, post) {
        if (err) {
          res.status(500).json({ error: 'Failed to query model ' + modelFormatted });
        } else if(!post) {
          res.status(404).json({ error: modelFormatted + ' not found'});
        } else {
          res.status(202).json({ error: 'Vote count incremented'});
        }
      });
    } else {
      res.status(500).json({ error: 'Invalid model ' + modelName });
    }
  }
};
