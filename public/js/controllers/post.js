'use strict';

app.controller('PostCtrl', ['$state','$stateParams', '$scope', '$http','$uibModal','CRMEditor','$sce', '$location', '$anchorScroll', function($state,$stateParams, $scope, $http,$uibModal,CRMEditor,$sce,$location,$anchorScroll) {

    $scope.toggleReply = {};
    $scope.anonymousMap = {};

    var init = function(){
        $http.get("/api/post/Classroom/"+$stateParams.classroomSlug+"/"+$stateParams.uid+"/"+$stateParams.slug)
            .success(function (data) {
                $scope.post=data;
                processCommentData(data.replies);
                console.log($scope.post)
                $scope.anonymousMap[$scope.post._id] = false;
                $scope.post.replies.forEach(function(e) {
                    $scope.toggleReply[e._id] = true;
                    $scope.anonymousMap[e._id] = false;
                });
            }).error(function(data, status, headers, config) {
                $scope.post={"_id":"563efdaaee8a06400bd4b41d","title":"Title","content":"<p><em><strong>hello this is Karen</strong></em></p>","date":"2015-11-08T07:45:46.021Z","vote":0,"replies":[{"_id":"563f0fa453ddd3eb2d9e7ed0","answer":"hello","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:28.021Z"},{"_id":"563f0fbc53ddd3eb2d9e7ed1","answer":"hello2","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:52.056Z"}],"author":{"userId":"563e904edb14c0253b811e2a"},"course":{"_id":"563ee3ff2d686230d935e830","title":"Machine Learning","courseNumber":"CS446","description":"Machine Learning","department":"CS","__v":0}};
                $scope.post.replies.forEach(function(e) {
                    $scope.toggleReply[e._id] = true;
                });
            });
    }
    init();

    $scope.orderBy='createdAt';
    $scope.reverse=true;

    $scope.trustAsHtml = function(htmlString){
        return $sce.trustAsHtml(htmlString)
    }

    $scope.gotoReply = function() {
        $location.hash('post-reply');
        $anchorScroll();
    };

    $scope.anonymousChanged = function(id){
        $scope.anonymousMap[id]=!$scope.anonymousMap[id];
    };
    $scope.hello = function(id){
        console.log(id)
    };

    var loadComment = function(){
        $http.get("/api/comment/"+$scope.post._id)
            .success(function (data) {
                processCommentData(data);
            }).error(function(data, status, headers, config) {

            });
    }
    var processCommentData = function(data){
        var parents = {};
        var children = [];
        data.forEach(function(e) {
            if(e.hasOwnProperty("_parent")&& e._parent!=null){
                children.push(e);
            } else {
                e.replies=[];
                parents[e._id]=e;
            }
        });
        children.forEach(function(e) {
            parents[e._parent].replies.push(e);
        });
        $scope.post.replies=[];
        for (var key in parents) {
            $scope.post.replies.push(parents[key]);
        }
    }

    $scope.replyTo = function(id) {
        var req={};
        req.postId=$scope.post._id;
        if(id!=$scope.post._id){
            req.parentId=id;
        }
        req.content = CRMEditor.getValue(id);
        req.anonymous=$scope.anonymousMap[id];
        console.log(req)
        $http.post('/api/comment',req).
            success(function(data, status, headers, config) {
                loadComment();
            }).
            error(function(data, status, headers, config) {

            });

    };
}])
;
