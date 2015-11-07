'use strict';

angular.module('app.consoleProcessCtrl', [])
    .controller('ProcessCtrl', ['$rootScope', '$state', '$scope', '$http','$modal','commonService', function($rootScope, $state, $scope, $http,$modal,commonService) {
      $http.get("/rest/process").success(function (data) {
        $scope.processList = data;
      });

    //$scope.processList = [{"_id":"559768867c9ed401db7c2559","title":"再生医疗","description":"再生医疗介绍.","step":1},{"_id":"55977225f5e7a4cc159b7446","title":"人性化治疗","description":"人性化治疗介绍.","step":2}]

    $scope.showDeleteModal = function(obj) {
      commonService.showDeleteModal(obj.title,'/rest/process/'+obj._id);
    };

    $scope.showAddModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/console/modal/AddUpdateProcessModal.html',
        controller: 'AddProcessModalCtrl',
        size: 'lg'
      });

      modalInstance.result.then(function (platformId) {
        $state.go($state.current, {}, {reload: true});
      });
    };

    $scope.showUpdateModal = function(obj) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/console/modal/AddUpdateProcessModal.html',
        controller: 'UpdateProcessModalCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            var item = obj;
            return item;
          }
        }
      });

      modalInstance.result.then(function (platformId) {
        $state.go($state.current, {}, {reload: true});
      });
    };
  }])
  .controller('AddProcessModalCtrl', ['$scope','$modalInstance','$http', function ($scope,$modalInstance,$http) {
    $scope.inSubmit=false;
    $scope.alerts = [];
    $scope.obj={};
    $scope.modalTitle='Add New Process';

    $scope.submit = function() {
      $scope.inSubmit=true;
      $http.post('/rest/process',$scope.obj).
        success(function(data, status, headers, config) {
          $scope.inSubmit=true;
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({type: 'danger',msg: 'Error adding process - ' + status + ':' + data.message});
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
  .controller('UpdateProcessModalCtrl', ['$scope','$modalInstance','$http','item', function ($scope,$modalInstance,$http,item) {
    $scope.inSubmit=false;
    $scope.alerts = [];
    $scope.obj={};
    $scope.obj.id=item._id;
    $scope.obj.title=item.title;
    $scope.obj.description=item.description;
    $scope.obj.step=item.step;
    $scope.modalTitle='Update Process ' + item.title;

    $scope.submit = function() {
      console.log("submitting")
      $scope.inSubmit=true;
      $http.put('/rest/process',$scope.obj).
        success(function(data, status, headers, config) {
          $scope.inSubmit=true;
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          $scope.alerts.push({type: 'danger',msg: 'Error adding process - ' + status + ':' + data.message});
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
