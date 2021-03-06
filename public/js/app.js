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
        'app.commonCtrl',
        'app.accessCtrl',
        'app.consoleHomeCtrl',
    'app.classroomCtrl',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers',
        'angular-jwt',
        'ui.calendar',
        'cgNotify',
        'ngImgCrop'
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
                controller: 'InitAppCtrl',
                templateUrl: 'tpl/app.html'
            })
            .state('app.console', {
                url:        '',
                templateUrl:'tpl/console/console.html'
            })
            .state('app.home', {
                url:        '/home',
                controller: 'ProfileCtrl',
                templateUrl:'tpl/console/profile.html',
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [
                                'js/controllers/profile.js',
                                'js/directives/TypeaheadDirective.js'
                            ]);
                        }]
                }
            })
            .state('app.profile', {
                url:        '/profile',
                controller: 'ProfileCtrl',
                templateUrl:'tpl/console/profile.html',
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [
                                'js/controllers/profile.js',
                                'js/directives/TypeaheadDirective.js'
                            ]);
                        }]
                }
            })
            .state('app.classroom', {
                url: '/classroom/:slug',
                controller: 'ClassroomCtrl',
                templateUrl:'tpl/console/classroom.html',
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [
                                'js/libs/bootstrap-tagsinput/src/bootstrap-tagsinput-angular.js',
                                'js/libs/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js',
                                'js/libs/bootstrap-tagsinput/src/bootstrap-tagsinput.css'
                            ]);
                        }]
                }
            })
            .state('app.calendar', {
                url: '/calendar/:slug',
                controller: 'CalendarCtrl',
                templateUrl:'tpl/console/calendar.html',
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [
                                'js/directives/DatetimepickerDirective.js'
                            ]);
                        }]
                }

            })
            .state('app.classroomPost', {
                url: '/classroom/:classroomSlug/:uid/:slug',
                controller: 'PostCtrl',
                templateUrl:'tpl/console/post.html',
                resolve: {
                    deps: ['uiLoad',
                        function( uiLoad ){
                            return uiLoad.load( [
                                'js/controllers/post.js'
                            ]);
                        }]
                }
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


            .state('login_signup', {
                url: '/s',
                controller: 'LoginCtrl',
                templateUrl:'tpl/access.html'
            })
            .state('access', {
                url: '/access',
                //template: '<div ui-view class="fade-in-right-big smooth"></div>'
                templateUrl:'tpl/access.html'
            })
            .state('login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl:'tpl/login.html'
            })
            .state('signup', {
                url: '/signup',
                controller: 'SignupCtrl',
                templateUrl:'tpl/signup.html'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'tpl/page_404.html'
            })

    }
  ]
)
        //.config(function Config($httpProvider, jwtInterceptorProvider) {
        //    jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http) {
        //        var jwt = localStorage.jwt;
        //        console.log("jwt="+jwt);
        //        var refreshToken = localStorage.getItem('refresh_token');
        //        if (jwt&&jwtHelper.isTokenExpired(jwt)) {
        //            // This is a promise of a JWT id_token
        //            return $http({
        //                url: '/delegation',
        //                // This will not send the JWT for this call
        //                skipAuthorization: true,
        //                method: 'POST',
        //                refresh_token : refreshToken
        //            }).then(function(response) {
        //                localStorage.setItem('JWT', response.data.jwt);
        //                return jwt;
        //            });
        //        } else {
        //            return jwt;
        //        }
        //    }
        //    $httpProvider.interceptors.push('jwtInterceptor');
        //})
    .config(function ($provide, $httpProvider) {

        // Intercept http calls.
        $provide.factory('HttpInterceptor', function ($q,$window,$location) {
            return {
                // On request success
                request: function (config) {
                    config.headers = config.headers || {};
                    var jwt = localStorage.jwt;
                    if (jwt) {
                        config.headers.Authorization = 'Bearer ' + jwt;
                    }
                    // Return the config or wrap it in a promise if blank.
                    return config || $q.when(config);
                },

                // On request failure
                requestError: function (rejection) {
                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response success
                response: function (response) {
                    return response || $q.when(response);
                },

                // On response failture
                responseError: function (response) {
                    if (response.status === 401) {
                        // handle the case where the user is not authenticated
                        $location.path('/access/login');
                    }

                    // Return the promise rejection.
                    return $q.reject(response);
                }
            };
        });

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('HttpInterceptor');

    })
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
