'use strict';

angular.module('app.consoleHomeCtrl', [])
  .controller('HomeCtrl', ['$rootScope', '$state', '$scope', '$http','$modal', function($rootScope, $state, $scope, $http,$modal) {

      $scope.doSearch = function(obj) {
        $http.get("/api/course?courseNumber="+$scope.inputQuery)
            .success(function (data) {
              $state.go("app.classroom", {classroomId:$scope.inputQuery});
            }).error(function(data, status, headers, config) {
              if(status==404){
                var modalInstance = $modal.open({
                  templateUrl: 'tpl/console/modal/ManageCourseModal.html',
                  controller: 'ManageCourseModalCtrl',
                  size: 'lg',
                  resolve: {
                    items: function () {
                      var items = {};
                      items.query=$scope.inputQuery;
                      return items;
                    }
                  }
                });
              }
            });

      };


  }])
  .controller('ManageCourseModalCtrl', ['$scope','$modalInstance','$http','item', function ($scope,$modalInstance,$http,item) {
    $scope.req={};
    $scope.modalTitle='Add new portal '+items.query+'?';
      $scope.isSubmitting=false;

    $scope.submit = function() {
      $scope.isSubmitting=true;
      $http.post('/api/course',$scope.req).
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
;
