app.directive('datetimepicker', ['$http','uiLoad',function($http,uiLoad) {
  return {
    restrict: 'AE', //E = element, A = attribute, C = class, M = comment
    transclude: true,
    scope: {
      ngModel:"="
    },
    link: function (scope, element, attrs) {
      uiLoad.load([
        'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
        'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
      ]).then(function() {
        element.datetimepicker({
          widgetPositioning:{horizontal: 'auto',vertical: 'bottom'},
          format: 'MM/DD/YYYY hh:mm a'
        });
        if(scope.ngModel){
          element.data("DateTimePicker").date(scope.ngModel);
        }
        element.on('dp.change', function(e){
          scope.$apply(function() {
            scope.ngModel= element.data("DateTimePicker").date();
            console.log(scope.ngModel)
          });
        })
      })
    }
  };
}]);
