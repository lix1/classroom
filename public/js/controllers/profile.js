'use strict';

app.controller('ProfileCtrl', ['$state','$stateParams', '$scope', '$http','$uibModal',function($state,$stateParams, $scope, $http,$uibModal) {
    var allday=['Monday','Tuesday','Wednesday','Thursday','Friday'];

    var init = function(){
        $http.get("/api/profile")
            .success(function (data) {
                console.log(data)
                $scope.profile=data;
            }).error(function(data, status, headers, config) {
                notify(data.message);
            });
        $http.get("/api/profile/thumbnail")
            .success(function (data) {
                $scope.thumbnail='data:image/png;base64,' + data;
            }).error(function(data, status, headers, config) {
                notify(data.message);
            });

    }
    init();

    $scope.getParentFromSlug = function(slug) {
        var regex = /(^\w+-[0-9]+-\w+)/;
        var matches = regex.exec(slug);
        if(matches!=null&&matches.length>0){
            return matches[1];
        }
        return slug;
    }

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
    $scope.deleteClass = function(course) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/console/modal/deleteObjectModal.html',
            controller: 'DeleteObjectModalCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    var items = {};
                    items.url = '/api/profile/schedule/'+course._id;
                    items.message = 'Remove course <span class="text-info-dk">' + course.name + '</span> from your schedule? This cannot be undone.';
                    return items;
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.profile.schedule = data.schedule;

        });
    }

    $scope.updateProfile = function(course) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/console/modal/UpdateProfileModal.html',
            controller: 'UpdateProfileModalCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    var items = {};
                    items.profile = $scope.profile;
                    return items;
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.profile.schedule = data.schedule;

        });
    }
    $scope.uploadImage = function(course) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/console/modal/UploadThumbnailModal.html',
            controller: 'UploadThumbnailModalCtrl',
            size: 'lg'
        });
        modalInstance.result.then(function (data) {
            $scope.profile.schedule = data.schedule;

        });
    }

    $scope.leave = function(id){
        $http.delete('/api/profile/join/'+id)
            .success(function(data, status, headers, config) {
                notify(data.message);
            })
            .error(function(data, status, headers, config) {
                notify(data.message);
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
    app.controller('UploadThumbnailModalCtrl', ['$scope','$uibModalInstance','$http', function ($scope,$uibModalInstance,$http) {
        $scope.myImage='';
        $scope.croppedImage='';

        $scope.fileChanged = function(evt){
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope){
                    $scope.myImage=evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        }

        $scope.upload = function(){
            if($scope.croppedImage.length>0){
                var req = {
                    "data":$scope.croppedImage
                };
                $http.put("/api/profile/thumbnail",req)
                    .success(function (data) {
                        $uibModalInstance.close($scope.croppedImage);
                        notify(data.message);
                    }).error(function(data, status, headers, config) {
                        notify(data.message);
                    });
            }
        }
    }]);
    app.controller('UpdateProfileModalCtrl', ['$scope','$uibModalInstance','$http','items', function ($scope,$uibModalInstance,$http,items) {
        $scope.profile = {
            firstName:items.profile.firstName,
            lastName:items.profile.lastName
        }
        $scope.submit = function(){
            $http.put("/api/profile",$scope.profile)
                .success(function (data) {
                    $uibModalInstance.close(data);
                    notify("Profile updated successfully");
                }).error(function(data, status, headers, config) {
                    notify(data.message);
                });
        }


    }]);
    app.controller('ManageCourseModalCtrl', ['$scope','$uibModalInstance','$http','items', function ($scope,$uibModalInstance,$http,items) {
        $scope.req={};
        $scope.course={};
        $scope.allday=['Monday','Tuesday','Wednesday','Thursday','Friday'];
        $scope.day=[];
        $scope.startTime=null;
        $scope.endTime=null;

        $scope.modalTitle='Add a class';
        var isCreate = true;

        var d = new Date();
        if(items!=null&&items.class!=null){
            isCreate=false;
            $scope.modalTitle='Edit ' + items.class.name;
            $scope.req._id=items.class._id;
            $scope.course.courseId=items.class.courseId;
            $scope.course.courseName=items.class.name;

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
            $scope.req.courseId=$scope.course.courseId;
            $scope.req.name=$scope.course.courseName;
            $scope.req.semester='Spring';
            $scope.req.year='2016';

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
