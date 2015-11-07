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
          question.votes=i*3;
          question.answerCount=i*2;
          question.title="question " + i;
          $scope.classroom.queations.push(question)
      }
  }])
;
