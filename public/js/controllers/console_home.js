'use strict';

angular.module('app.consoleHomeCtrl', [])
  .controller('HomeCtrl', ['$rootScope', '$state', '$scope', '$http','$uibModal', function($rootScope, $state, $scope, $http,$uibModal) {
      var init = function(){
        $http.get("/api/courses")
            .success(function (data) {
              $scope.courses=data;
            }).error(function(data, status, headers, config) {
              $scope.courses=[];
            });

      }
      init();

      $scope.doSearch = function() {
        $http.get("/api/course?courseNumber="+$scope.inputQuery)
            .success(function (data) {
              console.log(data)
              if(data!=null&&data!="null"){
                $state.go("app.classroom", {classroomId:$scope.inputQuery});
              } else {
                var modalInstance = $uibModal.open({
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
                modalInstance.result.then(function () {
                  init();
                });

              }
            }).error(function(data, status, headers, config) {
              var modalInstance = $uibModal.open({
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
              modalInstance.result.then(function () {
                init();
              });

            });

      };


  }])
  .controller('ManageCourseModalCtrl', ['$scope','$uibModalInstance','$http','items', function ($scope,$uibModalInstance,$http,items) {
    $scope.req={};
    $scope.modalTitle='Add new portal '+items.query+'?';
      $scope.isSubmitting=false;

    $scope.submit = function() {
      $scope.isSubmitting=true;
      $http.post('/api/course',$scope.req).
        success(function(data, status, headers, config) {
            $uibModalInstance.close();
        }).
        error(function(data, status, headers, config) {
          $scope.isSubmitting=false;
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }])
;
