'use strict';

angular.module('app.accessCtrl', [])
    .controller('LoginCtrl', ['$state', '$scope', '$http','$window',function($state, $scope, $http,$window) {
        $scope.isSubmitting = false;
        $scope.login=function(){
            $scope.isSubmitting = true;

            $http.post('/auth/login',$scope.user).
                success(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                    $state.go('app.console.home')
                    $window.sessionStorage.token = data.token;
                }).
                error(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                    delete $window.sessionStorage.token;
                    console.log(data);
                });

        }

    }])
    .controller('SignupCtrl', ['$state', '$scope', '$http',function($state, $scope, $http) {
        $scope.isSubmitting = false;
        $scope.signup=function(){
            $scope.isSubmitting = true;

            $http.post('/auth/signup',$scope.user).
                success(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                    $state.go('access.login')
                    console.log(data);
                }).
                error(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                    console.log(data);
                });

        }

        $scope.login=function(){
            $state.go('access.login')
        }
    }])
;
