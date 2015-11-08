var fs = require('fs'),
    path = require('path'),
    auth = require('./authentication'),
    user = require('./user'),
    AnswerModel = require('../models').Answer;

module.exports = {
  findByQuestion:function(questionId, success, err) {
    AnswerModel.find({questionId: questionId}, function (err, list) {
      if (err) {
        err(err);
      }
      var respList = [];
      for(var i=0;i<list.length;i++){
        var answer=list[i];
        var answerResp={};
        answer._id=answer._id;
        answer.answer=answer.answer;
        answer.date=answer.date;
        answer.comments=answer.comments;
        user.getById(answer.authorId, function(user){
          answer.author=user;
          respList.push(answerResp);
          if(respList.length==list.length){
            success(list);
          }
        })

      }

    });
  },
  create: function(req, res) {
    if(req.body.answer && req.body.questionId) {
      // todo: validate questionId
      var decoded = auth.decodeToken(req,function(decoded){
        var newAnswer = new AnswerModel({
          answer: req.body.answer,
          questionId: req.body.questionId,
          authorId: decoded.id
        });
        newAnswer.save(function(err, newAnswer) {
          if (err) {
            // error handling
            res.json(500, {error: "Error creating new question: " + err.message});
          }
          console.log('Successfully added new question ' + newAnswer._id);
          res.json(201, newAnswer)
        });

      }, function(err){
        res.json(500, { error: 'Failed to decoe token: ' + err });
      });
    } else {
      res.json(500, { error: 'Invalid request: missing required field(s)' });
    }
  }
};
