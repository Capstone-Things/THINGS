var app = angular.module("catthings_app");

//Login Controller
app.controller('LoginCheckController', ['$scope', '$location', 'thingsAPI',
  function ($scope, $location, thingsAPI) {
      // Can be used for Admin login
      $scope.user = {};

      $scope.errorMessage = "";

      $scope.LoginCheck = function () {
          var loginData = $scope.user;
          thingsAPI.authenticate(loginData).then(
            function (response) {
                if (response.status == 200) {
                    console.log(response);
                    console.log(response.headers());
                    console.log(response.headers('token'));
                    thingsAPI.setUserName(response.headers('username'));
                    thingsAPI.setAdmin(response.headers('admin'));
                    thingsAPI.setToken(response.headers('token'));
                    console.log(response.headers('admin'));
                    $location.path('home');
                }
            },
           function (err, response) {

               $scope.errorMessage = "Login failed: " + err.data;
               console.log(`AUTHENTICATE ERROR: ${err}, RESPONSE: ${response}`)
           }
          );
      };
  }]);
