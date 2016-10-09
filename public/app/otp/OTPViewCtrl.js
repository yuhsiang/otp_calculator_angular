(function(){
  'use strict';
  angular.module('otp.directive', [])
  .directive('otpItem', otpItem)

  function otpItem(OTPService, $timeout) {

    return {
      retrict: 'EA',
      templateUrl: 'otp/OTPView.html',
      scope: {
        secretCode : '@ngSecret',
        name : '@ngName',
        interval   : '=ngInterval'
      },
      link: link
    }

    function link(scope, elem, attrs) {

    var secretCode = undefined;
    var isLoading = true;
    var deregisterBackButton;
    var otp = new OTPService();
    scope.isOTPAvail = 0;
    otp.setInterval(scope.interval);

    OTPSecretInit(scope.secretCode);
    function OTPSecretInit(secretCode) {
      checkOTPAvailability(secretCode);
      otp.startGenerating(secretCode, notifiedOTPChange);
      isLoading = false;
      scope.isOTPAvail = true;
    }

    function checkOTPAvailability(secretCode) {
      if ("string" === typeof secretCode) {
        scope.isOTPAvail = 1;
      } else {
        scope.isOTPAvail = 0;
      }
    }

    function updateHintMessage() {
      if (isLoading) {
        scope.hint = "loading"
        return;
      }
      if (scope.isOTPAvail) {
      } else {
      }
    }

    function notifiedOTPChange(otp) {
      scope.otpObject = otp;
      updateHintMessage();
      $timeout(function(){
        scope.$apply();
      });
    }
    }
  }
})();
