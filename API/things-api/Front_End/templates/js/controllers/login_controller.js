/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/
/*
This file contains the AngularJS code for logging.
*/
var app = angular.module("catthings_app");

app.controller('LoginCheckController', ['$scope', '$location', 'thingsAPI',
  function ($scope, $location, thingsAPI) {
      // Can be used for Admin login
      $scope.user = {};
      $scope.errorMessage = "";
      /*
      This function authenticates the user credentials with those stored in the
      database using the API. If the credentials are correct, a token will be
      set with an expiration date of 7 days so that the user doesn't have to
      keep authenticating after every action.
      */
      $scope.LoginCheck = function () {
          var loginData = $scope.user;
          thingsAPI.authenticate(loginData).then(
            function (response) {
                if (response.status == 200) {
                    thingsAPI.setUserName(response.headers('username'));
                    thingsAPI.setAdmin(response.headers('admin'));
                    thingsAPI.setToken(response.headers('token'));
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
