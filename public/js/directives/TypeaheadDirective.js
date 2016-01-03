app.directive('courseTypeahead', ['$http','uiLoad',function($http,uiLoad) {
  return {
    restrict: 'AE', //E = element, A = attribute, C = class, M = comment
    replace: true,
    transclude: true,
    scope: {
      university: "@",valid:"@",courseId:"=",courseName:"=",ngModel:"="
    },
    template: 	'<div class="twitter-typeahead"><input class="typeahead form-control" type="text"></div>',
    link: function ($scope, element, attrs) {
      uiLoad.load([
        'bower_components/typeahead.js/dist/typeahead.bundle.min.js',
        'bower_components/handlebars/handlebars.min.js',
        'css/typeahead.css'
      ]).then(function() {
        var courseIds = [];
        var courseMap = {};
        $scope.valid = true;
        var courses = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('courseId'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,

          prefetch: {
            url: '/api/university/'+$scope.university+'?token='+localStorage.jwt,
            transform: function(response) {
              for(var i=0;i<response.courses.length;i++){
                var course = response.courses[i];
                courseIds.push(course.courseId);
              }
              response.courses.forEach(function(e) {
                courseMap[e.courseId]= e.name;
              });
              return response.courses;
            },
            ttl:1000
          },
          identify: function(obj) {
            return obj.courseId;
          }
        });
        function courseWithDefaults(q, sync) {
          if (q === '') {
            sync(courses.get(courseIds));
          } else {
            courses.search(q, sync);
          }
        }

        element.find('input.typeahead').typeahead({
          minLength: 0,
          highlight: true
        },{
          name: 'courses',
          display: 'courseId',
          source: courseWithDefaults,
          highlight:true,
          templates: {
            suggestion: Handlebars.compile('<div class="b-b"><h4>{{courseId}}</h4><span>{{name}}</span></div>')
          }
        });
        if($scope.ngModel!=null&&$scope.ngModel.courseId!=null){
          element.find('input.typeahead').typeahead('val', $scope.ngModel.courseId);
        }
        element.on('typeahead:change', function(ev, val) {
          if(courseIds.indexOf(val)==-1){
            element.find('input.tt-input').addClass('has-error');
            $scope.valid = false;
          } else {
            element.find('input.tt-input').removeClass('has-error');
            $scope.valid = true;
            $scope.ngModel.courseId = val;
            $scope.ngModel.courseName=courseMap[val];
          }
        });
        //element.on('typeahead:select', function(ev, suggestion) {
        //  $scope.courseId = suggestion.courseId;
        //  $scope.courseName = suggestion.name;
        //});

      })
    }
  };
}]);

app.directive('courseTypeahead1', ['$http','uiLoad',function($http,uiLoad) {
  return {
    restrict: 'AE', //E = element, A = attribute, C = class, M = comment
    replace: true,
    transclude: true,
    scope: {
      university: "@"
    },
//		template: '<input class="typeahead" type="text" placeholder="{{title}}">',
    template: 	'<div class="twitter-typeahead"><input class="typeahead form-control" type="text"></div>',
    link: function ($scope, element, attrs) {
      uiLoad.load([
        'bower_components/typeahead.js/dist/typeahead.bundle.min.js',
        'bower_components/handlebars/handlebars.min.js',
        'css/typeahead.css'
      ]).then(function() {
        var substringMatcher = function(strs) {
          return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
              if (substrRegex.test(str)) {
                matches.push(str);
              }
            });

            cb(matches);
          };
        };

        var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
          'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
          'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
          'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
          'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
          'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
          'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
          'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
          'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];

        element.find('input.typeahead').typeahead({
              hint: true,
              highlight: true,
              minLength: 1
            },
            {
              name: 'states',
              source: substringMatcher(states)
            });

        element.on('typeahead:change', function(ev, val) {
          if(states.indexOf(val)==-1){
            element.find('input.tt-input').addClass('has-error');
            console.log(element.find('input.tt-input'));
            console.log('error');
          } else {
            element.find('input.tt-input').removeClass('has-error');
          }
        });
      })

    }
  };
}]);

