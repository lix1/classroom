'use strict';

angular.module('app.classroomCtrl', ['datatables'])
    .controller('ClassroomCtrl', ['$state','$stateParams', '$scope', '$http','$uibModal','CRMEditor','DTOptionsBuilder','notify', function($state,$stateParams,$scope,$http,$uibModal,CRMEditor,DTOptionsBuilder,notify) {

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
            });

        //var createClassroom = function(){
        //    console.log('createClassroom')
        //    $http.post('/api/classroom/'+$stateParams.slug)
        //        .success(function(data, status, headers, config) {
        //            $scope.classroom=data;
        //        })
        //        .error(function(data, status, headers, config) {
        //            notify(data.message);
        //        });
        //}

        var init = function(){
            $http.get("/api/classroom/"+$stateParams.slug)
                .success(function (data) {
                    $scope.classroom=data;
                }).error(function(data, status, headers, config) {
                    notify(data.message);
                });
            $http.get("/api/post/Classroom/"+$stateParams.slug)
                .success(function (data) {
                    console.log(data)
                    $scope.posts=data;
                }).error(function(data, status, headers, config) {
                    if(status!=404){
                        notify(data.error);
                    }
                });
        }
        init();

        $scope.getPostedTime = function(time){
            var postMt = moment(time);
            var now = moment();
            var days = now.diff(postMt, 'days');
            if(days < 1) {
                var hours = now.diff(postMt, 'hours');
                if(hours < 1){
                    var minutes = now.diff(postMt, 'minutes');
                    if(minutes < 1) {
                        var seconds = now.diff(postMt, 'seconds');
                        return seconds + ' seconds ago';
                    } else {
                        return minutes + ' minutes ago';
                    }
                } else {
                    return hours + ' hours ago';
                }
                //} else if(days >= 1 && days <=3) {
                //    return days + ' days ago';
            } else {
                return postMt.format('YYYY-MM-DD HH:mm:ss');
            }
        }

        $scope.join = function(){
            var req={};
            req.classroomId=$scope.classroom._id;
            $http.put('/api/profile/join',req)
                .success(function(data, status, headers, config) {
                    notify(data.message);
                })
                .error(function(data, status, headers, config) {
                    notify(data.message);
                });
        }
        $scope.leave = function(){
            var req={};
            req.classroomId=$scope.classroom._id;
            $http.delete('/api/profile/join/'+$scope.classroom._id)
                .success(function(data, status, headers, config) {
                    notify(data.message);
                })
                .error(function(data, status, headers, config) {
                    notify(data.message);
                });
        }

        $scope.isSubmitting=false;
        $scope.addNewPost = function() {
            $scope.newPost.content = CRMEditor.getValue($scope.classroom._id);
            $scope.newPost.forumId = $scope.classroom._id;
            $scope.newPost.forumRef = 'Classroom';
            $scope.isSubmitting=true;
            console.log($scope.newPost)
            $http.post('/api/post',$scope.newPost).
                success(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                }).
                error(function(data, status, headers, config) {
                    $scope.isSubmitting=false;
                });
        }

        $scope.addGroup = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'tpl/console/modal/ManageClassroomGroupModal.html',
                controller: 'ManageGroupModalCtrl',
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
    .controller('ManageGroupModalCtrl', ['$scope','$http','$uibModalInstance','items', function($scope,$http,$uibModalInstance,items) {
        $scope.event={};
        $scope.event.type="Assignment";
        $scope.method="POST";
        if(items.event!=null){
            $scope.method="PUT";
            $scope.modalTitle="Edit group " + items.group.name;
            $scope.group.id=items.group.id;
            $scope.group.name=items.group.name;
            $scope.group.description=items.group.description;
        } else {
            $scope.modalTitle="Add new group";
        }
        $scope.isSubmitting = false;
        $scope.submit = function(){
            var req={};
            req.parentId=items.classroomId;
            req.group=$scope.group;
            $http({
                method: $scope.method,
                url: '/api/classroom',
                data:req
            }).then(function successCallback(response) {
                $scope.isSubmitting=false;
                $uibModalInstance.close($scope.group);
            }, function errorCallback(response) {
                $scope.isSubmitting=false;
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }])
    .controller('CalendarCtrl', ['$scope','$http','$stateParams','$uibModal', function($scope,$http,$stateParams,$uibModal) {
        $scope.events=[];
        $http.get("/api/classroom/calendar/"+$stateParams.slug)
            .success(function (data) {
                console.log(data)
                $scope.classroom=data;
                $scope.classroom.calendar.forEach(function(e) {
                    var event={};
                    event.id=e._id;
                    event.title=e.title;
                    event.start=new Date(e.startTime);
                    event.end=new Date(e.endTime);
                    event.className=['b-success bg-success'];
                    event.info=e.note;
                    event.stick=true;
                    event.timezone="EST";
                    $scope.events.push(event);
                });
            }).error(function(data, status, headers, config) {
            });

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
                height: "100%",
                editable: false,
                header:{
                    left: 'month basicWeek basicDay',
                    center: 'title',
                    right: 'today prev next'
                },
                eventMouseover: $scope.alertOnMouseOver
            }
        };
        $scope.eventTimeFormat = function(time) {
            if(time){
                return time.tz("EST").format("dddd, MMMM Do YYYY, h:mm:ss a");
            }
        }

        $scope.addEvent = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'tpl/console/modal/ManageCalendarEventModal.html',
                controller: 'ManageCalendarEventModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        var items = {};
                        items.classroomId=$scope.classroom.id;
                        return items;
                    }
                }
            });
            modalInstance.result.then(function (event) {
                $scope.events.push({
                    title: event.title,
                    start: new Date(event.startTime),
                    end:new Date(event.endTime),
                    className:['b-success bg-success'],
                    info:event.note,
                    stick:true,
                    ignoreTimezone:true
                });
            });
        };
        $scope.editEvent = function(event) {
            var modalInstance = $uibModal.open({
                templateUrl: 'tpl/console/modal/ManageCalendarEventModal.html',
                controller: 'ManageCalendarEventModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        var items = {};
                        items.classroomId=$scope.classroom.id;
                        items.event=event;
                        return items;
                    }
                }
            });
            modalInstance.result.then(function (event) {

            });
        };
        $scope.deleteEvent = function(event) {
            var modalInstance = $uibModal.open({
                templateUrl: 'tpl/console/modal/deleteObjectModal.html',
                controller: 'DeleteObjectModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        var items = {};
                        items.url='/api/classroom/calendar/'+$scope.classroom.id+'/'+event.id;
                        items.message='<p>Delete event <label class="label bg-info m-xs">'+event.title+'</label>? This cannot be undone. </p>'
                        return items;
                    }
                }
            });
            modalInstance.result.then(function (event) {

            });
        };


        /* remove event */
        $scope.remove = function(index) {
            $scope.events.splice(index,1);
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events];
    }])
    .controller('ManageCalendarEventModalCtrl', ['$scope','$http','$uibModalInstance','items', function($scope,$http,$uibModalInstance,items) {
        $scope.config={
            minuteStep:1
        }
        $scope.event={};
        $scope.event.type="Assignment";
        $scope.method="POST";
        if(items.event!=null){
            $scope.method="PUT";
            $scope.modalTitle="Edit event " + items.event.title;
            $scope.event.id=items.event.id;
            $scope.event.title=items.event.title;
            $scope.event.note=items.event.info;
            $scope.startTime=items.event.start;
            $scope.endTime=items.event.end;
        } else {
            $scope.modalTitle="New event";
        }
        $scope.isSubmitting = false;
        $scope.submit = function(){
            if($scope.startTime){
                $scope.event.startTime=$scope.startTime.tz("EST").format()
            }
            if($scope.endTime){
                $scope.event.endTime=$scope.endTime.tz("EST").format()
            }
            var req={};
            req.classroomId=items.classroomId;
            req.event=$scope.event;
            $http({
                method: $scope.method,
                url: '/api/classroom/calendar',
                data:req
            }).then(function successCallback(response) {
                $scope.isSubmitting=false;
                $uibModalInstance.close($scope.event);
            }, function errorCallback(response) {
                $scope.isSubmitting=false;
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }])
;
