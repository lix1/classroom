'use strict';

angular.module('app.consoleHospitalCtrl', ['datatables'])
    .controller('ClassroomCtrl', ['$state','$stateParams', '$scope', '$http','$modal', function($state,$stateParams, $scope, $http,$modal) {
        $http.get("/api/course?id="+$stateParams.classroomId)
            .success(function (data) {
                console.log(data)
                $scope.classroom=data;
            }).error(function(data, status, headers, config) {
                $scope.classroom={"_id":"563ee3ff2d686230d935e830","courseNumber":"CS446","department":"CS","description":"Machine Learning","title":"Machine Learning","questions":[{"_id":"563efdaaee8a06400bd4b41d","title":"Title","details":"Question","courseId":"563ee3ff2d686230d935e830","authorId":"563e904edb14c0253b811e2a","__v":0,"date":"2015-11-08T07:45:46.021Z"},{"_id":"563efe3fee8a06400bd4b41e","title":"Title","details":"Question","courseId":"563ee3ff2d686230d935e830","authorId":"563e904edb14c0253b811e2a","__v":0,"date":"2015-11-08T07:48:15.116Z"}]};
            });

        $scope.askQuestion = function() {
            var modalInstance = $modal.open({
                templateUrl: 'tpl/console/modal/ManageQuestionModal.html',
                controller: 'ManageQuestionModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        var items = {};
                        items.classroomId=$scope.classroom._id;
                        return items;
                    }
                }
            });
        };


    }])
    .controller('ManageQuestionModalCtrl', ['$scope','$modalInstance','$http','items', function ($scope,$modalInstance,$http,items) {
        $scope.req={};
        $scope.modalTitle='Ask Question';
        $scope.isSubmitting=false;
        $scope.req.courseId=items.classroomId;
        $scope.submit = function() {
            $scope.isSubmitting=true;
            $http.post('/api/question',$scope.req).
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
    .controller('QuestionCtrl', ['$state','$stateParams', '$scope', '$http','$modal', function($state,$stateParams, $scope, $http,$modal) {
        $http.get("/api/question/"+$stateParams.questionId)
            .success(function (data) {
                console.log(data)
                $scope.question=data;
            }).error(function(data, status, headers, config) {
                $scope.question={"_id":"563efdaaee8a06400bd4b41d","title":"Title","details":"Question","date":"2015-11-08T07:45:46.021Z","vote":0,"answers":[{"_id":"563f0fa453ddd3eb2d9e7ed0","answer":"hello","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:28.021Z"},{"_id":"563f0fbc53ddd3eb2d9e7ed1","answer":"hello2","questionId":"563efdaaee8a06400bd4b41d","authorId":"563e904edb14c0253b811e2a","__v":0,"comments":[],"date":"2015-11-08T09:02:52.056Z"}],"author":{"userId":"563e904edb14c0253b811e2a"},"course":{"_id":"563ee3ff2d686230d935e830","title":"Machine Learning","courseNumber":"CS446","description":"Machine Learning","department":"CS","__v":0}};
            });

        $scope.answerQuestion = function() {
            $scope.req.questionId=$stateParams.questionId;
            $http.post('/api/answer',$scope.req).
                success(function(data, status, headers, config) {
                    console.log(data);
                }).
                error(function(data, status, headers, config) {

                });

        };
    }])
    .controller('CalendarCtrl', ['$scope', function($scope) {

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        /* event source that pulls from google.com */
        $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
        };

        /* event source that contains custom events on the scope */
        $scope.events = [
            {title:'All Day Event', start: new Date(y, m, 1), className: ['b-l b-2x b-info'], location:'New York', info:'This a all day event that will start from 9:00 am to 9:00 pm, have fun!'},
            {title:'Dance class', start: new Date(y, m, 3), end: new Date(y, m, 4, 9, 30), allDay: false, className: ['b-l b-2x b-danger'], location:'London', info:'Two days dance training class.'},
            {title:'Game racing', start: new Date(y, m, 6, 16, 0), className: ['b-l b-2x b-info'], location:'Hongkong', info:'The most big racing of this year.'},
            {title:'Soccer', start: new Date(y, m, 8, 15, 0), className: ['b-l b-2x b-info'], location:'Rio', info:'Do not forget to watch.'},
            {title:'Family', start: new Date(y, m, 9, 19, 30), end: new Date(y, m, 9, 20, 30), className: ['b-l b-2x b-success'], info:'Family party'},
            {title:'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2), className: ['bg-success bg'], location:'HD City', info:'It is a long long event'},
            {title:'Play game', start: new Date(y, m, d - 1, 16, 0), className: ['b-l b-2x b-info'], location:'Tokyo', info:'Tokyo Game Racing'},
            {title:'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false, className: ['b-l b-2x b-primary'], location:'New York', info:'Party all day'},
            {title:'Repeating Event', start: new Date(y, m, d + 4, 16, 0), alDay: false, className: ['b-l b-2x b-warning'], location:'Home Town', info:'Repeat every day'},
            {title:'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/', className: ['b-l b-2x b-primary']},
            {title:'Feed cat', start: new Date(y, m+1, 6, 18, 0), className: ['b-l b-2x b-info']}
        ];

        /* alert on dayClick */
        $scope.precision = 400;
        $scope.lastClickTime = 0;
        $scope.alertOnEventClick = function( date, jsEvent, view ){
            var time = new Date().getTime();
            if(time - $scope.lastClickTime <= $scope.precision){
                $scope.events.push({
                    title: 'New Event',
                    start: date,
                    className: ['b-l b-2x b-info']
                });
            }
            $scope.lastClickTime = time;
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };

        $scope.overlay = $('.fc-overlay');
        $scope.alertOnMouseOver = function( event, jsEvent, view ){
            $scope.event = event;
            $scope.overlay.removeClass('left right').find('.arrow').removeClass('left right top pull-up');
            var wrap = $(jsEvent.target).closest('.fc-event');
            var cal = wrap.closest('.calendar');
            var left = wrap.offset().left - cal.offset().left;
            var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
            if( right > $scope.overlay.width() ) {
                $scope.overlay.addClass('left').find('.arrow').addClass('left pull-up')
            }else if ( left > $scope.overlay.width() ) {
                $scope.overlay.addClass('right').find('.arrow').addClass('right pull-up');
            }else{
                $scope.overlay.find('.arrow').addClass('top');
            }
            (wrap.find('.fc-overlay').length == 0) && wrap.append( $scope.overlay );
        }

        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                dayClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventMouseover: $scope.alertOnMouseOver
            }
        };

        /* add custom event*/
        $scope.addEvent = function() {
            $scope.events.push({
                title: 'New Event',
                start: new Date(y, m, d),
                className: ['b-l b-2x b-info']
            });
        };

        /* remove event */
        $scope.remove = function(index) {
            $scope.events.splice(index,1);
        };

        /* Change View */
        $scope.changeView = function(view, calendar) {
            $('.calendar').fullCalendar('changeView', view);
        };

        $scope.today = function(calendar) {
            $('.calendar').fullCalendar('today');
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events];
    }]);
;
