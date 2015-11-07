var fs = require('fs'),
  path = require('path'),
  HospitalModels = require('../models').Hospital;

var findHospitalByRanking = function(ranking, foundCallback, notFoundCallback, errorCallback) {
  HospitalModels.findOne({ranking: ranking}, function (err, hospital) {
    if (err) {
      if (errorCallback != null)errorCallback(err.message);
    }
    if (hospital) {
      if (foundCallback != null)foundCallback(hospital);
    } else {
      if (notFoundCallback != null)notFoundCallback();
    }
  });
}

module.exports = {
  all: function(req, res) {
    HospitalModels.find({}, function(err, docs) {
      if (err) {
        res.json(500, {error: "Error getting hospitals: " + err.message});
      }
      res.json(200, docs);
    });
  },
  get: function(req, res) {
    if(req.params.id) {
      HospitalModels.findOne({_id: req.params.id}, function (err, hospital) {
        if (err) {
          res.json(500, {error: "Error getting hospital by id " + req.params.id +": " + err.message});
        }
        if (hospital) {
          res.json(200, hospital);
        } else {
          res.json(500, {error: "Hospital with id " + req.params.id +" not found"});
        }
      });
    } else {
      res.json(500, { error: 'Bad request: missing hospital id' });
    }
  },
  create: function(req, res) {
    // insert the new item into the collection (validate first)
    if(req.body.name && req.body.ranking) {
      // validate index doesn't exist
      findHospitalByRanking(req.body.ranking, function(item){
        // found hospital with index
        res.json(500, { eintrorror: 'Hospital with ranking = ' + item.ranking + ' ['+item.name+'] already exists' });
      }, function(){
        // not found, save item
        var newHospital = new HospitalModels({
          name: req.body.name,
          name_en: req.body.name_en,
          introduction: req.body.introduction,
          address: req.body.address,
          homepage: req.body.homepage,
          ranking: req.body.ranking
        });
        newHospital.save(function(err, newHospital) {
          if (err) {
            // error handling
            res.json(500, {error: "Error inserting hospital: " + err.message});
          }
          console.log('Successfully inserted hospital ' + newHospital.name + ' [id='+newHospital._id+'] with ranking=' + newHospital.ranking);
          res.json(201, newHospital);
        });
      }, function(errMsg){
        // error
        res.json(500, { error: errMsg });
      });
    } else {
      res.json(500, { error: 'Bad request: missing hospital name or ranking' });
    }
  },
  update: function(req, res) {
    if(req.body.id) {
      HospitalModels.findOne({_id:req.body.id}, function(err, item) {
        if (err) {
          res.json(500, {error: "Error finding hospital item["+req.body.id+"]: " + err.message});
        }
        if (item) {
          item.address=req.body.address;
          item.homepage=req.body.homepage;
          item.introduction=req.body.introduction;
          item.name=req.body.name;
          item.name_en=req.body.name_en;
          item.ranking=req.body.ranking;
          item.save(function(err) {
            if (err) {
              res.json(500, {error: "Error updating hospital item: " + err.message});
            }
            res.json(200, item);
          });
        } else {
          res.json(500, {error: "Hospital item["+req.body.id+"] not found"});
        }
      });
    } else {
      res.json(500, { error: 'Bad request: missing hospital id' });
    }
  },
  delete: function(req, res) {
    if(req.params.id) {
      HospitalModels.findOneAndRemove({_id:req.params.id}, function(err, doc){
        if (err) {
          res.json(500, {error: "Error deleting hospital ["+req.params.id+"]: " + err.message});
        }
        res.json(200, doc);
      });
    } else {
      res.json(500, { error: 'Bad request: missing hospital id' });
    }
  }
};
