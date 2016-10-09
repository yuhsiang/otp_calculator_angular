'use strict';

angular.module('userListCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/userList', {
    templateUrl: 'userList/userList.html',
    controller: 'UserListCtrl'
  });
}])

.controller('UserListCtrl', function($scope, userListService, $location) {
   $scope.users = [];
   $scope.inputName = "";
   $scope.userClick = userClick;
   $scope.addUser = addUser;
   getUsers();

   function getUsers() {
      userListService.get().then(function(data){
           $scope.users = data.data;
           console.log(data);
      });
   }

   function addUser() {
      if ($scope.inputName.length <= 0) {
          console.log('input empty');
          return;
      }
      userListService.create({text: $scope.inputName}).then(getUsers);
   }
   function userClick(user) {
      userListService.putCacheUser(user);
      $location.path('otplist');

   }
});
