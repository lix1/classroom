'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])
  .factory('CRMEditor', function($http,$state) {
    return {
      getValue: function(id) {
        return CKEDITOR.instances[id].getData();
      },
      clear: function(id) {
        return CKEDITOR.instances[id].setData('');
      }
    };
  });
;
