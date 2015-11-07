var fs = require('fs'),
  path = require('path'),
  ProcessModels = require('../models').Process;

module.exports = {
  all: function(req, res) {
    ProcessModels.find({}, function(err, docs) {
      if (err) {
        res.json(500, {error: "Error getting processes: " + err.message});
      }
      res.json(200, docs);
    });
  },
  get: function(req, res) {
    if(req.params.id) {
      ProcessModels.findOne({_id: req.params.id}, function (err, process) {
        if (err) {
          res.json(500, {error: "Error getting process by id " + req.params.id +": " + err.message});
        }
        if (process) {
          res.json(200, process);
        } else {
          res.json(500, {error: "Process with id " + req.params.id +" not found"});
        }
      });
    } else {
      res.json(500, { error: 'Bad request: missing process id' });
    }
  },
  create: function(req, res) {
    // insert the new item into the collection (validate first)
    if(req.body.title && req.body.step) {
      var newProcess = new ProcessModels({
        title: req.body.title,
        description: req.body.description,
        step: req.body.step
      });
      newProcess.save(function(err, newProcess) {
        if (err) {
          // error handling
          res.json(500, {error: "Error inserting process: " + err.message});
        }
        console.log('Successfully inserted process ' + newProcess.title + ' [id='+newProcess._id+'] with ranking=' + newProcess.step);
        res.json(201, newProcess);
      });
    } else {
      res.json(500, { error: 'Bad request: missing process name or step' });
    }
  },
  update: function(req, res) {
    if(req.body.id) {
      ProcessModels.findOne({_id:req.body.id}, function(err, item) {
        if (err) {
          res.json(500, {error: "Error finding process item["+req.body.id+"]: " + err.message});
        }
        if (item) {
          item.title=req.body.title;
          item.description=req.body.description;
          item.step=req.body.step;
          item.save(function(err) {
            if (err) {
              res.json(500, {error: "Error updating process item: " + err.message});
            }
            res.json(200, item);
          });
        } else {
          res.json(500, {error: "Process item["+req.body.id+"] not found"});
        }
      });
    } else {
      res.json(500, { error: 'Bad request: missing process id' });
    }
  },
  delete: function(req, res) {
    if(req.params.id) {
      ProcessModels.findOneAndRemove({_id:req.params.id}, function(err, doc){
        if (err) {
          res.json(500, {error: "Error deleting process ["+req.params.id+"]: " + err.message});
        }
        res.json(200, doc);
      });
    } else {
      res.json(500, { error: 'Bad request: missing process id' });
    }
  }
};
