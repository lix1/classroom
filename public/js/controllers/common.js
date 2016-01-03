'use strict';
angular.module('app.commonCtrl', [])
    .controller('DeleteObjectModalCtrl', ['$scope','$uibModalInstance','$http','items','$sce', function ($scope,$uibModalInstance,$http,items,$sce) {
        $scope.message = function(){
            return $sce.trustAsHtml(items.message)
        }

        $scope.submit = function(){
            $scope.isSubmitting=true;
            $http.delete(items.url)
                .then(function(resp, status, headers, config) {
                    $uibModalInstance.close(resp.data);
                }, function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);