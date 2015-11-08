'use strict';

angular.module('app.consoleHospitalCtrl', ['datatables'])
    .controller('ClassroomCtrl', ['$state','$stateParams', '$scope', '$http','$modal', function($state,$stateParams, $scope, $http,$modal) {
        $http.get("/api/course?id="+$stateParams.classroomId)
            .success(function (data) {
                console.log(data)
                $scope.classroom=data;
            }).error(function(data, status, headers, config) {
                $scope.classroom={"_id":"563ee3ff2d686230d935e830","courseNumber":"CS446","department":"CS","description":"Machine Learning","title":"Machine Learning","questions":[{"_id":"563efdaaee8a06400bd4b41d","title":"Title","details":"Question","courseId":"563ee3ff2d686230d935e830","authorId":"563e904edb14c0253b811e2a","__v":0,"date":"2015-11-08T07:45:46.021Z"},{"_id":"563efe3fee8a06400bd4b41e","title":"Title","details":"Question","courseId":"563ee3ff2d686230d935e830","authorId":"563e904edb14c0253b811e2a","__v":0,"date":"2015-11-08T07:48:15.116Z"}]};
            });

        $scope.askQuestion = function() {
            var modalInstance = $modal.open({
                templateUrl: 'tpl/console/modal/ManageQuestionModal.html',
                controller: 'ManageQuestionModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        var items = {};
                        items.classroomId=$scope.classroom._id;
                        return items;
                    }
                }
            });
        };


    }])
    .controller('ManageQuestionModalCtrl', ['$scope','$modalInstance','$http','items', function ($scope,$modalInstance,$http,items) {
        $scope.req={};
        $scope.modalTitle='Ask Question';
        $scope.isSubmitting=false;
        $scope.req.courseId=items.classroomId;
        $scope.submit = function() {
            $scope.isSubmitting=true;
            $http.post('/api/question',$scope.req).
                success(function(data, status, headers, config) {
                    $modalInstance.close();
                }).
                error(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('QuestionCtrl', ['$state','$stateParams', '$scope', '$http','$modal', function($state,$stateParams, $scope, $http,$modal) {
        $http.get("/api/question/"+$stateParams.questionId)
            .success(function (data) {
                console.log(data)
                $scope.question=data;
            }).error(function(data, status, headers, config) {
                $scope.question={"_id":"563efdaaee8a06400bd4b41d","title":"Title","details":"Question","date":"2015-11-08T07:45:46.021Z","vote":0,"answers":[{"_id":"563f0fa453ddd3eb2d9e7ed0","answer":"hello","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:28.021Z"},{"_id":"563f0fbc53ddd3eb2d9e7ed1","answer":"hello2","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:52.056Z"}],"author":{"userId":"563e904edb14c0253b811e2a"},"course":{"_id":"563ee3ff2d686230d935e830","title":"Machine Learning","courseNumber":"CS446","description":"Machine Learning","department":"CS","__v":0}};
            });

        $scope.answerQuestion = function() {
            $scope.req.questionId=$stateParams.questionId;
            $http.post('/api/answer',$scope.req).
                success(function(data, status, headers, config) {
                    console.log(data);
                }).
                error(function(data, status, headers, config) {

                });

        };
    }])
;
