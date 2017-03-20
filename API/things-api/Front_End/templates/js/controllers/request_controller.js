/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for making requests for items that do not
exist in the inventory.
*/
var app = angular.module("catthings_app");

app.controller('RequestController', ['$scope', '$http', '$location', '$window', 'thingsAPI', RequestController]);
function RequestController($scope, $http, $location, $window, thingsAPI){
  $scope.question = {
    itemName: undefined,
    quantityNeeded: undefined,
    personName: undefined,
    email: undefined,
    date: undefined,
    description: undefined,
    message: undefined
  };

  /*
  This function emails the request for new item to the CAT
  */
  $scope.sendRequest = function() {
    var qData = $scope.question;
    thingsAPI.request(qData).then(function(response){
      if(response.status === 200){
        $window.alert("Request submitted succesfully");
      }
      else{
        $window.alert("Unable to submit request. Please try again or contact an administrator");
      }
    });
  };
}
