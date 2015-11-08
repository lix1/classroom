'use strict';

angular.module('app.consoleHospitalCtrl', ['datatables'])
    .controller('ClassroomCtrl', ['$state','$stateParams', '$scope', '$http','$modal', function($state,$stateParams, $scope, $http,$modal) {
        $http.get("/api/course?id="+$stateParams.classroomId)
            .success(function (data) {
                console.log(data)
                $scope.classroom=data;
            }).error(function(data, status, headers, config) {
                $scope.classroom={"_id":"563ee3ff2d686230d935e830","title":"Machine Learning","courseNumber":"CS446","description":"Machine Learning","department":"CS","__v":0}
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
        console.log($stateParams.questionId)
        $scope.question = {};
        var i = 1;
        $scope.question.id=i;
        $scope.question.votes=i*3;
        $scope.question.answerCount=i*2;
        $scope.question.title="question " + i;
        $scope.question.tags=["node.js","angular.js"]
        $scope.question.classroom={};
        $scope.question.classroom.id=1;
        $scope.question.classroom.title="CS446";
        $scope.question.classroom.name="Machine Learning";
    }])
;
