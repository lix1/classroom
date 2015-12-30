'use strict';

angular.module('app.consoleMainCtrl', [])
    .controller('DeleteModalCtrl', ['$scope','$uibModalInstance','$http','item', function ($scope,$uibModalInstance,$http,item) {
    $scope.isSubmitting=false;
    $scope.alerts = [];
    $scope.message="Delete entity [ "+item.name+" ] from the database?"

    $scope.submit = function() {
      $scope.isSubmitting=true;
      $http.delete(item.url).
        success(function(data, status, headers, config) {
          $scope.isSubmitting=false;
              $uibModalInstance.close();
        }).
        error(function(data, status, headers, config) {
          $scope.isSubmitting=false;
          $scope.alerts.push({type: 'danger',msg: 'Error deleting '+item.name+' - ' + status + ':' + data.message});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }])
;
