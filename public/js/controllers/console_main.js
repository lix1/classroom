'use strict';

angular.module('app.consoleMainCtrl', [])
    .controller('DeleteModalCtrl', ['$scope','$modalInstance','$http','item', function ($scope,$modalInstance,$http,item) {
    $scope.isSubmitting=false;
    $scope.alerts = [];
    $scope.message="Delete entity [ "+item.name+" ] from the database?"

    $scope.submit = function() {
      $scope.isSubmitting=true;
      $http.delete(item.url).
        success(function(data, status, headers, config) {
          $scope.isSubmitting=false;
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          $scope.isSubmitting=false;
          $scope.alerts.push({type: 'danger',msg: 'Error deleting '+item.name+' - ' + status + ':' + data.message});
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
