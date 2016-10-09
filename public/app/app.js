'use strict';

// Declare app level module which depends on views, and components
angular.module('App', [
  'ngRoute',
  'OTPListCtrl',
  'myApp.version',
  'otp.directive',
  'OTP.Service',
  'angular-progress-arc',
  'userListCtrl',
  'userListService',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/userList'});
}]);
