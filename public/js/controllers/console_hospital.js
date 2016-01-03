'use strict';

angular.module('app.consoleHospitalCtrl', ['datatables'])
    .controller('ClassroomCtrl', ['$state','$stateParams', '$scope', '$http','$uibModal', 'DTOptionsBuilder', function($state,$stateParams,$scope,$http,$uibModal,DTOptionsBuilder) {

        $scope.isNewPostCollapsed = true;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(50)
            .withLanguage({
                "sEmptyTable":     "No posts in this classroom yet",
                "sInfo":           "Showing _START_ to _END_ of _TOTAL_ posts",
                "sInfoEmpty":      "Showing 0 to 0 of 0 posts",
                "sInfoFiltered":   "(filtered from _MAX_ total posts)",
                "sInfoPostFix":    "",
                "sInfoThousands":  ",",
                "sLengthMenu":     "Show _MENU_ posts",
                "sLoadingRecords": "Loading...",
                "sProcessing":     "Processing...",
                "sSearch":         "Search:",
                "sZeroRecords":    "No matching posts found",
                "oPaginate": {
                    "sFirst":    "First",
                    "sLast":     "Last",
                    "sNext":     "Next",
                    "sPrevious": "Previous"
                }
            });;

        var init = function(){
            $http.get("/api/classroom/"+$stateParams.year+"/"+$stateParams.semester+"/"+$stateParams.courseId)
                .success(function (data) {
                    console.log(data)
                    $scope.classroom=data;
                }).error(function(data, status, headers, config) {
                    $scope.classroom={"__v":0,"courseId":"CMSC122","name":"Introduction to Computer Programming via the Web","semester":"Spring","year":2016,"_id":"56885dd41109bd1a3c4539de","updatedTS":"2016-01-02T23:31:32.010Z","createdTS":"2016-01-02T23:31:32.010Z","_members":[]};
                });
        }
        init();




        // todo: delete later
        $scope.askQuestion = function() {
            var modalInstance = $uibModal.open({
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
            modalInstance.result.then(function () {
                init();
            });

        };


    }])
    .controller('ManageQuestionModalCtrl', ['$scope','$uibModalInstance','$http','items', function ($scope,$uibModalInstance,$http,items) {
        $scope.req={};
        $scope.modalTitle='Ask Question';
        $scope.isSubmitting=false;
        $scope.req.courseId=items.classroomId;
        $scope.submit = function() {
            $scope.isSubmitting=true;
            $http.post('/api/question',$scope.req).
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
    .controller('CalendarCtrl1', ['$scope', function($scope) {
        $scope.eventSources = [];
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };
    }])
        .controller('CalendarCtrl', ['$scope','$http','$stateParams', function($scope,$http,$stateParams) {

        $http.get("/api/course?id="+$stateParams.classroomId)
            .success(function (data) {
                $scope.course=data;
            }).error(function(data, status, headers, config) {
                $scope.course={"_id":"563ee3ff2d686230d935e830","courseNumber":"CS446","department":"CS","description":"Machine Learning","title":"Machine Learning","questions":[{"_id":"563efdaaee8a06400bd4b41d","title":"Title","details":"Question","courseId":"563ee3ff2d686230d935e830","authorId":"563e904edb14c0253b811e2a","__v":0,"date":"2015-11-08T07:45:46.021Z"},{"_id":"563efe3fee8a06400bd4b41e","title":"Title","details":"Question","courseId":"563ee3ff2d686230d935e830","authorId":"563e904edb14c0253b811e2a","__v":0,"date":"2015-11-08T07:48:15.116Z"}]};
            });



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
            {title:'Midterm Exam Review', start: new Date(y, m, 1), className: ['b-l b-2x b-info'], location:'UMD', info:'Midterm Exam Review in class.'},
            {title:'TA Discussion', start: new Date(y, m, 3), end: new Date(y, m, 4, 9, 30), allDay: false, className: ['b-l b-2x b-danger'], location:'UMD', info:'TA Discussion.'},
            {title:'HW2 due', start: new Date(y, m, 8, 15, 0), className: ['b-l b-2x b-info'], location:'UMD', info:'HW2 due. HW2 weights 10%'},
            {title:'Project proposal due', start: new Date(y, m, 9, 19, 30), end: new Date(y, m, 9, 20, 30), className: ['b-l b-2x b-success'], info:'Project proposal due. Project proposal is at least 5 pages'},
            {title:'Work on project in class', start: new Date(y, m, d - 5), end: new Date(y, m, d - 1), className: ['bg-success bg'], location:'UMD', info:'No lectures. Work on project in class. '},
            {title:'Quiz5', start: new Date(y, m, d - 1, 16, 0), className: ['b-l b-2x b-info'], location:'UMD', info:'Quiz5 in class today'},
            {title:'Project proposal due ', start: new Date(y, m, d + 4, 16, 0), alDay: false, className: ['b-l b-2x b-warning'], location:'UMD', info:'Project proposal due'},
            {title:'Project presentation', start: new Date(y, m+1, 6, 18, 0), className: ['b-l b-2x b-info']}
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
