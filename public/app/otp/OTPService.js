(function(){
  'use strict';
  var OTPModule = angular.module('OTP.Service', []);

  OTPModule.factory('OTPService', OTPService);

  function OTPService($q) {
    
    var intervalId = 0;
    var OTP_SECRET = "opt_secret";
    var STAT_START = 1;
    var STAT_STOP = 2;

    var OTPService = function() {
       return this;
    }

    function dec2hex(s) {
      return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    function hex2dec(s) {
      return parseInt(s, 16);
    };

    function leftpad(s, l, p) {
      if(l + 1 >= s.length) {
          s = Array(l + 1 - s.length).join(p) + s;
      }
      return s;
    };

    function base32tohex(base32) {
      var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      var bits = "";
      var hex = "";
      for(var i = 0; i < base32.length; i++) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
      }
      for(var i = 0; i + 4 <= bits.length; i+=4) {
        var chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16) ;
      }
      return hex;
    };

    function getTime() {
      return Math.ceil(Date.now() / 1000);
    }

    var OTP = function(secret, timeIntev) {
      var self = this;
      self.code = "000000";
      self.time = 0;
      self.secret = secret;
      if ("undefined" === typeof timeIntev) {
         self.timeIntev = OTP.TIME_INTEV;
      } else {
         self.timeIntev = timeIntev;
      }
      this.updateOtp();
    }

    OTP.TIME_INTEV = 30*2*5;

    OTP.prototype.updateOtp = function() {
      var self = this;
      try {
        var epoch = getTime();
        var time = leftpad(dec2hex(Math.floor(epoch / self.timeIntev)), 16, "0");
        var hmacObj = new jsSHA("SHA-1", "HEX");
        hmacObj.setHMACKey(base32tohex(self.secret), "HEX");
        hmacObj.update(time);
        var hmac = hmacObj.getHMAC("HEX");
        var offset = hex2dec(hmac.substring(hmac.length - 1));
        var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";

        self.code = (otp).substr(otp.length - 6, 6);
      } catch (error) {
        console.log(error);
      }
    }

    OTP.prototype.updateProgress = function() {
      var self = this;
      var epoch = getTime();
      var numerator = epoch % self.timeIntev;
      self.progress =  numerator / self.timeIntev;
      // var countDown = OTP.TIME_INTEV - (epoch % OTP.TIME_INTEV);
    }

    OTP.prototype.updateCountdown = function() {
      var self = this;
      var epoch = getTime();
      self.countdown = self.timeIntev - (epoch % self.timeIntev);
    }

    OTPService.prototype.setInterval = function(time) {
      var self = this;
      self.interval = time;
    }

    OTPService.prototype.startGenerating = function(secret, notifyCB) {
      var self = this;
      var otp = new OTP(secret, self.interval);
      calculate(1);
      intervalId = setInterval(calculate, 1000);
      this.stat = STAT_START;
      function calculate(ignoreTime) {
        if (self.stat === STAT_STOP) {
          self.stopGenerating();
          return;
        }
        if (getTime() % otp.timeIntev == 0 || ignoreTime) {
          otp = new OTP(secret, otp.timeIntev);
          otp.updateProgress();
          otp.updateCountdown();
          notifyCB(otp);
        } else {
          var copiedOTP = angular.copy(otp);
          copiedOTP.updateProgress();
          copiedOTP.updateCountdown();
          notifyCB(copiedOTP);
        }
      }

      return otp;
    };

    OTPService.prototype.stopGenerating = function() {
      clearInterval(intervalId);
      this.stat = STAT_STOP;
    }

    return OTPService;
  }
})();
