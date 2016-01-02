var fs = require('fs'),
    path = require('path'),
    UniversityModel = require('../models').University;

module.exports = {
    create: function(req, res) {
        if(req.body.name && req.body.domain && req.body.courses && req.body.courses.length>0) {
            // todo: only admin can add university
            //var decoded = auth.decodeToken(req,function(decoded){
            var newItem = new UniversityModel({
                name: req.body.name,
                webAddress: req.body.webAddress,
                domain: req.body.domain,
                courses: req.body.courses
            });
            newItem.save(function(err, item) {
                if (err) {
                    res.json(500, {error: "Error adding new university: " + err.message});
                }
                console.log('Successfully added new university ' + item._id);
                res.json(201, item)
            });

            //}, function(err){
            //    res.json(401, { error: 'Failed to decoe token: ' + err });
            //});
        } else {
            res.json(400, { error: 'Invalid request: missing required field(s)' });
        }
    },
    findById:function(req, res) {
        var id = req.params.id;
        UniversityModel.findOne({_id: id}, function (err, item) {
            if (err) {
                res.json(500, {error: "Error getting university by id "+id+" : " + err.message});
            }
            res.json(200, item)
        });
    },

}
