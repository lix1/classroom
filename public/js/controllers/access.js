'use strict';

angular.module('app.accessCtrl', [])
    .controller('LoginCtrl', ['$state', '$scope', '$http','$window',function($state, $scope, $http,$window) {
        console.log('hi')
        $scope.isSubmitting = false;
        $scope.login=function(){
            $scope.isSubmitting = true;

            $http.post('/auth/login',$scope.loginUser).
                success(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                    $state.go('app.home')
                    localStorage.setItem('jwt',data.token);
                    console.log(localStorage.getItem('jwt'));
                }).
                error(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                    localStorage.setItem('jwt',null);
                });

        }

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
    .controller('ProfileCtrl', ['$state', '$scope', '$http',function($state, $scope, $http) {
        console.log('hi')
    }])
;
