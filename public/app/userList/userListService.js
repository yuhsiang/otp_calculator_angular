angular.module('userListService', [])
  .factory('userListService', ['$http',function($http) {
    var cacheUser = undefined;
    return {
      get : function() {
        return $http.get('/api/user_otp');
      },
      create : function(todoData) {
        return $http.post('/api/user_otp', todoData);
      },
      delete : function(id) {
        return $http.delete('/api/user_otp/' + id);
      },
      updateOTP : function(id, userUpdate) {
        return $http.put('/api/user_otp/' + id, userUpdate);
      },
      putCacheUser: putCacheUser,
      getCacheUser: getCacheUser,
    }

    function putCacheUser(user) {
       cacheUser = user;
    }

    function getCacheUser() {
       return cacheUser;
    }
  }]);
