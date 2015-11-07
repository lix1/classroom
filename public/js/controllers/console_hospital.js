'use strict';

angular.module('app.consoleHospitalCtrl', ['datatables'])
    .controller('ClassroomCtrl', ['$state','$stateParams', '$scope', '$http','$modal', function($state,$stateParams, $scope, $http,$modal) {
        console.log($stateParams.classroomId)
        $scope.classroom = {};
        $scope.classroom.id=1;
        $scope.classroom.title="CS446";
        $scope.classroom.name="Machine Learning";
        $scope.classroom.queations=[];
        for (var i=0;i<10;i++){
            var question = {};
            question.id=i;
            question.votes=i*3;
            question.answerCount=i*2;
            question.title="question " + i;
            question.tags=["node.js","angular.js"]
            $scope.classroom.queations.push(question)
        }
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
