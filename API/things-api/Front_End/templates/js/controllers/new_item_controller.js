/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for adding new items to the inventory.
The controller acts as an intermediary between the add item page and the API.
Information from the user is sent here from the webpage which is passed
along to the API which will insert the new item.
*/

var app = angular.module("catthings_app");

app.controller('NewItemController', ['$scope', '$http', '$location', 'thingsAPI', NewItemController]);
function NewItemController($scope, $http, $location, thingsAPI){
  $scope.addNewItem = function() {
    thingsAPI.add($scope.itemName, $scope.qty, $scope.description, $scope.price, $scope.threshold, $scope.tags)
    .then(function(response){
      if(response.status === 200){
        $location.path("home");
      }
    });
  }
}
