'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])
  .factory('commonService', function($http,$state,$modal) {
    return {
      showDeleteModal: function(name,url) {
        var modalInstance = $modal.open({
          templateUrl: 'tpl/console/modal/deleteObjectModal.html',
          controller: 'DeleteModalCtrl',
          size: 'lg',
          resolve: {
            item: function () {
              var item = {};
              item.name=name;
              item.url=url;
              return item;
            }
          }
        });

        modalInstance.result.then(function (platformId) {
          $state.go($state.current, {}, {reload: true});
        });
      }
    };
  });
;
