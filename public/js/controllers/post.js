'use strict';

app.controller('PostCtrl', ['$state','$stateParams', '$scope', '$http','$uibModal','CRMEditor','$sce', '$location', '$anchorScroll',
                    function($state,$stateParams, $scope, $http,$uibModal,CRMEditor,$sce,$location,$anchorScroll) {
    $scope.toggleReply = {};

    var init = function(){
        $http.get("/api/question/"+$stateParams.questionId)
            .success(function (data) {
                console.log(data)
                $scope.post=data;
            }).error(function(data, status, headers, config) {
                $scope.post={"_id":"563efdaaee8a06400bd4b41d","title":"Title","content":"<p><em><strong>hello this is Karen</strong></em></p>","date":"2015-11-08T07:45:46.021Z","vote":0,"replies":[{"_id":"563f0fa453ddd3eb2d9e7ed0","answer":"hello","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:28.021Z"},{"_id":"563f0fbc53ddd3eb2d9e7ed1","answer":"hello2","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:52.056Z"}],"author":{"userId":"563e904edb14c0253b811e2a"},"course":{"_id":"563ee3ff2d686230d935e830","title":"Machine Learning","courseNumber":"CS446","description":"Machine Learning","department":"CS","__v":0}};
                $scope.post.replies.forEach(function(e) {
                    $scope.toggleReply[e._id] = true;
                });

            });

    }
    init();


    $scope.trustAsHtml = function(htmlString){
        return $sce.trustAsHtml(htmlString)
    }

    $scope.gotoReply = function() {
        $location.hash('post-reply');
        $anchorScroll();
    };

    $scope.answerQuestion = function(id) {
        var data = CRMEditor.getValue(id);
        var req={};
        req.questionId=$stateParams.questionId;
        $http.post('/api/answer',req).
            success(function(data, status, headers, config) {
                init();
            }).
            error(function(data, status, headers, config) {

            });

    };
}])
;
