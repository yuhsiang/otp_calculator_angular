'use strict';

angular.module('OTPListCtrl', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/otplist', {
    templateUrl: 'otp/OTPList.html',
    controller: 'OTPListCtrl'
  });
}])

.controller('OTPListCtrl', function($scope, userListService) {
  $scope.inputCode = "";
  $scope.inputInterval = 0;
  $scope.addOTP = addOTP;
  $scope.inputName = "";
  $scope.user = userListService.getCacheUser();
  $scope.removeOTP = removeOTP;

  function addOTP() {
    var user = $scope.user;
    if (isNaN(Number($scope.inputInterval))) {
       return;
    }
    if ($scope.inputCode.length <= 0) {
       return;
    }
    if ($scope.inputName.length <= 0) {
       return;
    }
    user.keys.push({key: $scope.inputCode, interval: $scope.inputInterval, name: $scope.inputName});
    userListService.updateOTP($scope.user._id, user).then(function(data){
       console.log(data);
    });
  }

  function removeOTP(key) {
    var user = $scope.user;
    for (var i = 0; i < user.keys.length; i++) {
      if (key._id === user.keys[i]._id) {
        user.keys.splice(i, 1);
      }
    }
 
    userListService.updateOTP($scope.user._id, user).then(function(data){
      console.log(data);
    });
  }

});
