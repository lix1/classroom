'use strict';

app.controller('ProfileCtrl', ['$state','$stateParams', '$scope', '$http','$uibModal',function($state,$stateParams, $scope, $http,$uibModal) {
    var allday=['Monday','Tuesday','Wednesday','Thursday','Friday'];

    var init = function(){
        $http.get("/api/profile")
            .success(function (data) {
                console.log(data)
                $scope.profile=data;
            }).error(function(data, status, headers, config) {
                $scope.profile={"_id":"lix1@umd.edu","firstName":"karen","lastName":"li","_university":{"_id":"5685d15964003731e5e53bd9","name":"University of Maryland, College Park","id":"5685d15964003731e5e53bd9"},"__v":0,"updatedTS":"2016-01-02T02:42:05.080Z","createdTS":"2016-01-02T02:42:05.080Z","schedule":[{"courseId":"CMSC122","name":"Introduction to Computer Programming via the Web","building":"ITE","startTime":"12:00 pm","endTime":"12:15 pm","professor":"Don Roth","room":"330","day":["Monday","Tuesday","Wednesday","Thursday","Friday"]},{"courseId":"CMSC122","name":"Introduction to Computer Programming via the Web","building":"ITE","startTime":"12:00 pm","endTime":"12:15 pm","professor":"Don Roth","room":"330","day":["Monday","Wednesday"]},{"courseId":"CMSC132","name":"Object-Oriented Programming II","startTime":"12:00 pm","endTime":"12:10 pm","_id":"5687610fc22db768240f16aa","day":["Monday","Wednesday"]},{"courseId":"CMSC198A","name":"Special Topics in Computer Science for Non-Majors","startTime":"12:00 pm","endTime":"12:10 pm","_id":"568763c387f96a1c29ce86bc","day":["Monday","Wednesday"]}],"minor":[],"major":[]};
            });

    }
    init();

    $scope.addClass = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'tpl/console/modal/ManageCourseModal.html',
            controller: 'ManageCourseModalCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (schedule) {
            $scope.profile.schedule = schedule;
        });
    }
    $scope.editClass = function(course) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/console/modal/ManageCourseModal.html',
            controller: 'ManageCourseModalCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    var items = {};
                    items.class = course;
                    return items;
                }
            }
        });
        modalInstance.result.then(function (schedule) {
            $scope.profile.schedule = schedule;

        });
    }

    $scope.getDayStr = function(dayArr) {
        var str = '';
        allday.forEach(function(e) {
            if(dayArr.indexOf(e)>-1){
                switch (e) {
                    case 'Monday':
                        str+='M'
                        break;
                    case 'Tuesday':
                        str+='T'
                        break;
                    case 'Wednesday':
                        str+='W'
                        break;
                    case 'Thursday':
                        str+='TH'
                        break;
                    case 'Friday':
                        str+='F'
                        break;
                }
            }
        });
        return str;
    }
}]);
    app.controller('ManageCourseModalCtrl', ['$scope','$uibModalInstance','$http','items', function ($scope,$uibModalInstance,$http,items) {
        $scope.req={};
        $scope.allday=['Monday','Tuesday','Wednesday','Thursday','Friday'];
        $scope.day=[];
        $scope.startTime=null;
        $scope.endTime=null;

        $scope.modalTitle='Add a class';
        var isCreate = true;

        var d = new Date();
        if(items!=null&&items.class!=null){
            console.log(items.class)

            isCreate=false;
            $scope.modalTitle='Edit ' + items.class.name;
            $scope.req._id=items.class._id;
            $scope.req.courseId=items.class.courseId;
            $scope.req.name=items.class.name;

            var st = new Date();
            var stMoment = moment(items.class.startTime, "hh:mm a")
            st.setHours(stMoment.hours());
            st.setMinutes( stMoment.minutes() );
            $scope.startTime = st;

            var ed = new Date();
            var edMoment = moment(items.class.endTime, "hh:mm a")
            ed.setHours(edMoment.hours());
            ed.setMinutes( edMoment.minutes() );
            $scope.endTime = ed;

            items.class.day.forEach(function(e) {
                $scope.day[e]=true;
            });

            $scope.req.building = items.class.building;
            $scope.req.room = items.class.room;
            $scope.req.professor = items.class.professor;
        } else {
            d.setHours( 12 );
            d.setMinutes( 0 );
            $scope.startTime = d;
            $scope.endTime = d;
        }
        $scope.isSubmitting=false;


        $scope.submit = function() {
            $scope.req.day=[];
            if((isCreate && ($scope.startTime!=d || $scope.endTime!=d)) || !isCreate){
                var startTimeM = moment($scope.startTime).format("hh:mm a");
                var endTimeM = moment($scope.endTime).format("hh:mm a");

                $scope.req.startTime=startTimeM;
                $scope.req.endTime=endTimeM;
            }
            $scope.allday.forEach(function(e) {
                if($scope.day[e]==true){
                    $scope.req.day.push(e);
                }
            });
            console.log($scope.req)

            $scope.isSubmitting=true;
            $http({
                method: isCreate?'POST':'PUT',
                url: '/api/profile/schedule',
                data:$scope.req
            }).then(function(resp, status, headers, config) {
                $uibModalInstance.close(resp.data.schedule);
            }, function(data, status, headers, config) {
                $scope.isSubmitting=false;
            });

            //$http.post('/api/profile/schedule',$scope.req).
            //    success(function(data, status, headers, config) {
            //        $uibModalInstance.close(data);
            //    }).
            //    error(function(data, status, headers, config) {
            //        $scope.isSubmitting=false;
            //    });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
;
