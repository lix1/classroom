var fs = require('fs'),
  path = require('path'),
  IntroModels = require('../models').Intro;

var findIntroByIndex = function(index, foundCallback, notFoundCallback, errorCallback){
  IntroModels.findOne({ index: index }, function(err, item) {
    if (err) {
      if(errorCallback!=null)errorCallback(err.message);
    }
    if (item) {
      if(foundCallback!=null)foundCallback(item);
    } else {
      if(notFoundCallback!=null)notFoundCallback();
    }
  });
};

module.exports = {
  all: function(req, res) {
    IntroModels.find({}, function(err, docs) {
      if (err) {
        res.json(500, {error: "Error getting intro items: " + err.message});
      }
      res.json(200, docs);
    });
  },
  create: function(req, res) {
    // insert the new item into the collection (validate first)
    if(req.body.title && req.body.index) {
      // validate index doesn't exist
      findIntroByIndex(req.body.index, function(item){
        // found intro with index
        res.json(500, { eintrorror: 'Intro with index = ' + item.index + ' ['+item.title+'] already exists' });
      }, function(){
        // not found, save item
        var newIntro = new IntroModels({
          title: req.body.title,
          description: req.body.description,
          index: req.body.index
        });
        newIntro.save(function(err, newIntro) {
          if (err) {
            // error handling
            res.json(500, {error: "Error inserting intro: " + err.message});
          }
          console.log('Successfully inserted intro ' + newIntro.title + ' [id='+newIntro._id+'] with index=' + newIntro.index);
          res.json(201, newIntro);
        });
      }, function(errMsg){
        // error
        res.json(500, { error: errMsg });
      });
    } else {
      res.json(500, { error: 'Bad request: missing intro title or index' });
    }
  },
  update: function(req, res) {
    if(req.body.id) {
      IntroModels.findOne({_id:req.body.id}, function(err, item) {
        if (err) {
          res.json(500, {error: "Error finding intro item["+req.body.id+"]: " + err.message});
        }
        if (item) {
          item.title=req.body.title;
          item.description=req.body.description;
          if(item.index!=req.body.index){
            // update index
            findIntroByIndex(req.body.index, function(item){
              // found intro with index
              res.json(500, { eintrorror: 'Intro with index = ' + item.index + ' ['+item.title+'] already exists' });
            }, function(){
              // not found, update index and save item
              item.index=req.body.index;
              item.save(function(err) {
                if (err) {
                  res.json(500, {error: "Error updating intro item: " + err.message});
                }
                res.json(200, item);
              });

            }, function(errMsg){
              // error
              res.json(500, { error: errMsg });
            });
          } else {
            item.save(function(err) {
              if (err) {
                res.json(500, {error: "Error updating intro item: " + err.message});
              }
              res.json(200, item);
            });
          }
        } else {
          res.json(500, {error: "intro item["+req.body.id+"] not found"});
        }
      });
    } else {
      res.json(500, { error: 'Bad request: missing intro id' });
    }
  },
  delete: function(req, res) {
    if(req.params.id) {
      IntroModels.findOneAndRemove({_id:req.params.id}, function(err, doc){
        if (err) {
          res.json(500, {error: "Error deleting intro item["+req.params.id+"]: " + err.message});
        }
        res.json(200, doc);
      });
    } else {
      res.json(500, { error: 'Bad request: missing intro id' });
    }
  }
};
