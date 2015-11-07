'use strict';

angular.module('app.consoleHospitalCtrl', [])
  .controller('ClassroomCtrl', ['$state','$stateParams', '$scope', '$http','$modal', function($state,$stateParams, $scope, $http,$modal) {
      console.log($stateParams.classroomId)
      $scope.classroom = {};
      $scope.classroom.id=1;
      $scope.classroom.title="CS446";
      $scope.classroom.name="Machine Learning";
  }])
;
