'use strict';

angular.module('app.consoleHomeCtrl', [])
  .controller('HomeCtrl', ['$rootScope', '$state', '$scope', '$http','$modal','commonService', function($rootScope, $state, $scope, $http,$modal,commonService) {

      $scope.doSearch = function(obj) {
        console.log($scope.inputQuery)
        $state.go("app.classroom", {classroomId:$scope.inputQuery});
      };
      













  }])
  .controller('AddIntroductionModalCtrl', ['$scope','$modalInstance','$http', function ($scope,$modalInstance,$http) {
    $scope.inSubmit=false;
    $scope.alerts = [];
    $scope.obj={};
    $scope.modalTitle='Add New Introduction';

    $scope.submit = function() {
      $scope.inSubmit=true;
      $http.post('/rest/intro',$scope.obj).
        success(function(data, status, headers, config) {
          $scope.inSubmit=true;
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({type: 'danger',msg: 'Error adding introduction - ' + status + ':' + data.message});
          $scope.inSubmit=false;
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }])
  .controller('UpdateIntroductionModalCtrl', ['$scope','$modalInstance','$http','item', function ($scope,$modalInstance,$http,item) {
    $scope.inSubmit=false;
    $scope.alerts = [];
    $scope.obj={};
    $scope.obj.id=item._id;
    $scope.obj.title=item.title;
    $scope.obj.description=item.description;
    $scope.obj.index=item.index;
    $scope.modalTitle='Update Introduction ' + item.title;

    $scope.submit = function() {
      $scope.inSubmit=true;
      $http.put('/rest/intro',$scope.obj).
        success(function(data, status, headers, config) {
          $scope.inSubmit=true;
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({type: 'danger',msg: 'Error adding introduction - ' + status + ':' + data.message});
          $scope.inSubmit=false;
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }])
;
