'use strict';

angular.module('app.consoleHomeCtrl', [])
  .controller('HomeCtrl', ['$rootScope', '$state', '$scope', '$http','$modal', function($rootScope, $state, $scope, $http,$modal) {
      $http.get("/api/courses")
          .success(function (data) {
            $scope.courses=data;
          }).error(function(data, status, headers, config) {
            $scope.courses=[{"_id":"563ee3ff2d686230d935e830","title":"Machine Learning","courseNumber":"CS446","description":"Machine Learning","department":"CS","__v":0}]
          });


      $scope.doSearch = function() {
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
  .controller('ManageCourseModalCtrl', ['$scope','$modalInstance','$http','items', function ($scope,$modalInstance,$http,items) {
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
