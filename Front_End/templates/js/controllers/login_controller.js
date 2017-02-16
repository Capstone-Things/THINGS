var app = angular.module("catthings_app");

//Login Controller
app.controller('LoginCheckController', ['$scope', '$location', 'thingsAPI',
  function ($scope, $location,  thingsAPI) {
    // Can be used for Admin login
    $scope.user = {};
    $scope.showAdminLogin = false;

    $scope.LoginCheck = function() {
      var loginData = $scope.user;
      thingsAPI.authenticate(loginData).then(
        function(response){
            if(response.status == 200){
              console.log(response);
              console.log(response.headers);
              thingsAPI.setUserName(response.headers('username'));
              thingsAPI.setadmin(response.headers('admin'));
              thingsAPI.setToken(response.headers('token'));
              $location.path('home');
            }
       },
       function(err, response){
         console.log(`AUTHENTICATE ERROR: ${err}, RESPONSE: ${response}`)
       }
      );
    };
  $scope.SetAdminLogin = function() {
    $scope.showAdminLogin = !$scope.showAdminLogin;
  }
}]);
