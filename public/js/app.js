'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'ui.router.tabs',
    'oc.lazyLoad',
    'app.consoleHomeCtrl',
    'app.consoleHospitalCtrl',
    'app.consoleMainCtrl',
    'app.consoleProcessCtrl',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers'
])
.run(
    [          '$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)
.config(
  [          '$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($stateProvider,   $urlRouterProvider,   $controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;

        $urlRouterProvider
            .otherwise('/app/home');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'tpl/app.html'
            })
            .state('app.console', {
                url:        '',
                templateUrl:'tpl/console/console.html'
            }).state('app.console.home', {
                url:        '/home',
                controller: 'HomeCtrl',
                templateUrl:'tpl/console/home.html'
            })
            .state('app.classroom', {
              url: '/classroom/:classroomId',
              controller: 'ClassroomCtrl',
              templateUrl:'tpl/console/classroom.html'
            })
            .state('app.tabs.hospitals.detail', {
                url: '/{id}',
                views: {
                    'detail': {
                        controller: 'HospitalDetailCtrl',
                        templateUrl:'tpl/console/hospitalDetail.html'
                    }
                }
            }).state('app.tabs.contactus', {
                url:        '/contactus',
                controller: 'ContactUSCtrl',
                templateUrl:'tpl/console/contactus.html'
            })



            .state('access', {
                url: '/access',
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state('access.404', {
                url: '/404',
                templateUrl: 'tpl/page_404.html'
            })

    }
  ]
)

// oclazyload config
.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: [
            {
                name: 'toaster',
                files: [
                    'js/libs/modules/toaster/toaster.js',
                    'js/libs/modules/toaster/toaster.css'
                ]
            }
        ]
    });
}])
;
