var fs = require('fs'),
    path = require('path'),
    auth = require('./authentication'),
    user = require('./user'),
    AnswerModel = require('../models').Answer;


var findByQuestion = function(questionId, success, err) {
  AnswerModel.find({questionId: questionId}, function (err, list) {
    console.log(list)
    if (err) {
      err(err);
    }
    var respList = [];
    if(list.length==0){
      success(list);

    }
    for(var i=0;i<list.length;i++){
      var answer=list[i];
      var answerResp={};
      answerResp._id=answer._id;
      answerResp.answer=answer.answer;
      answerResp.date=answer.date;
      answerResp.comments=answer.comments;
      user.getById(answer.authorId, function(user){
        console.log(user)

        answerResp.author=user;
        respList.push(answerResp);
        if(respList.length==list.length){
          success(respList);
        }
      })

    }

  });
}

module.exports = {
  getByQuestion: function(req, res) {
    findByQuestion(req.query.questionId, function(list){
      res.json(200, list)

    }, function(err){
      res.json(500, { error:  err });
    })
  },
  findByQuestion:findByQuestion,
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
