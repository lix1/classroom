app.directive('datetimepicker', ['$http','uiLoad',function($http,uiLoad) {
  return {
    restrict: 'AE', //E = element, A = attribute, C = class, M = comment
    replace: true,
    transclude: true,
    scope: {
      ngModel:"="
    },
    template: 	'<div class="event-dt input-group date">'+
                  '<input type="text" class="form-control"/>'+
                  '<span class="input-group-addon">'+
                  '<span class="fa fa-calendar-o"></span>'+
                  '</span> ' +
                '</div>',
    link: function (scope, element, attrs) {
      uiLoad.load([
        'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
        'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
      ]).then(function() {
        element.datetimepicker({
          widgetPositioning:{horizontal: 'auto',vertical: 'bottom'}
        });
        element.on('dp.change', function(e){
          scope.$apply(function() {
            scope.ngModel= e.timeStamp;
          });
        })
      })
    }
  };
}]);
