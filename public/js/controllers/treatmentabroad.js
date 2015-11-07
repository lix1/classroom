'use strict';

angular.module('app.treatmentAbroadCtrl', [])
    .controller('TabsController', ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {
      $scope.initialise = function() {

        $scope.go = function(state) {
          $state.go(state);
        };

        $scope.tabData   = [
          {
            heading: '首页',
            route:   'app.tabs.home'
          },
          {
            heading: '服务项目',
            route:   'app.tabs.services'
          },
          {
            heading: '海外医院',
            route:   'app.tabs.hospitals'
          },
          {
            heading: '联系我们',
            route:   'app.tabs.contactus'
          }
        ];
      };

      $scope.initialise();
    }])
    .controller('HomeCtrl', ['$scope','$http', function($scope,$http) {
      $http.get("/intro").success(function (data) {
        $scope.newsList = data;
        console.log(data);
      });

    }]).controller('ServicesCtrl', ['$scope','$http', function($scope,$http) {
      $http.get("data/services.json").success(function (data) {
        console.log(data);
        $scope.serviceList = data.services;
      });
    }])
    .controller('HospitalsCtrl', ['$scope','$modal','$http','$state','$window', function($scope,$modal,$http,$state,$window) {
      $http.get("data/hospitals.json").success(function (data) {
        console.log(data);
        $scope.hospitals = data.hospitals;
      });

      $scope.goToHospital = function(id) {
        $state.go('app.tabs.hospitals.detail',{"id":id});
      };

      $scope.showMap = function(hospital) {
        var modalInstance = $modal.open({
          templateUrl: 'tpl/treatmentabroad/mapModal.html',
          controller: 'MapModalInstanceCtrl',
          size: 'lg',
          resolve: {
            items: function () {
              var items = {};
              items.hospital=hospital;
              return items;
            }
          }
        });hospitalDetail.html
      }
      $scope.showHomepage = function(url) {
        $window.open(url);
      }
    }])
    .controller('MapModalInstanceCtrl', ['$scope','$modalInstance','items', function($scope,$modalInstance, items) {
      $scope.color = {
        primary: '#7266ba',
        info:    '#23b7e5',
        success: '#27c24c',
        warning: '#fad733',
        danger:  '#f05050',
        light:   '#e8eff0',
        dark:    '#3a3f51',
        black:   '#1c2b36'
      }
      var marker= {"latLng":items.hospital.latLng, "name":items.hospital.name}
      $scope.marker = marker;
      $scope.hospital = items.hospital;
      $scope.cancel = function () {
        $modalInstance.close();
      };
    }])
    .controller('HospitalDetailCtrl', ['$scope','$modal','$http','$stateParams', function($scope,$modal,$http,$stateParams) {
      var id = parseInt($stateParams.id);
      $scope.hospital = {};
      $http.get("data/hospitals.json").success(function (data) {
        $scope.hospital = data.hospitals.filter(function(e) {
          return e.id == id;
        })[0];
        console.log($scope.hospital);
      });
    }])
    .controller('CasesCtrl', ['$scope', function($scope) {
      $scope.caseList = [
        {type:'肿瘤',list:[
          { name: '海外特色治疗', description: '海外特色治疗'},
          { name: '肿瘤镜像治疗', description: '肿瘤镜像治疗'},
          { name: '微创治疗', description: '微创治疗'},
          { name: '个体化治疗', description: '个体化治疗'},
          { name: '什么什么治疗', description: '什么什么治疗'},
          { name: '什么什么什么治疗', description: '什么什么什么治疗'}
        ]},
        {type:'心血管',list:[
          { name: '海外特色治疗', description: '海外特色治疗'},
          { name: '肿瘤镜像治疗', description: '肿瘤镜像治疗'},
          { name: '微创治疗', description: '微创治疗'},
          { name: '个体化治疗', description: '个体化治疗'},
          { name: 'title', description: 'description'},
          { name: 'title', description: 'description'}
        ]},
        {type:'神经',list:[
          { name: '海外特色治疗', description: '海外特色治疗'},
          { name: '肿瘤镜像治疗', description: '肿瘤镜像治疗'},
          { name: '微创治疗', description: '微创治疗'},
          { name: '个体化治疗', description: '个体化治疗'},
          { name: 'title1', description: 'description1'},
          { name: 'title1', description: 'description1'}
        ]}
      ];

      $scope.selectedIndex = 0;
      $scope.selectedCases = $scope.caseList[0];
      $scope.navChanged = function(event,index){
        $scope.selectedIndex = index;
        $scope.selectedCases = $scope.caseList[index];

      }
    }])
    .controller('ContactUSCtrl', ['$scope','$http', function($scope,$http) {
      $http.get("data/contacts.json").success(function (data) {
        $scope.phoneNumbers = data.phoneNumbers;
      });
    }]);
