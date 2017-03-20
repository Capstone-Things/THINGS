/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for generating a shopping list. In other
words, this will display all items at or below their assigned thresholds.
*/

var app = angular.module("catthings_app");
app.controller('ShoppingListController', ['$scope', '$http', 'thingsAPI', 'DTOptionsBuilder' , ShoppingListController]);
function ShoppingListController($scope, $http, thingsAPI, DTOptionsBuilder) {
  //Datatable Initialization
  $scope.dtOptions = new DTOptionsBuilder.newOptions()
                      .withDOM('rtp')
                      .withDisplayLength("50")
                      .withButtons(['print']);

  //Get the shopping list
  thingsAPI.getShoppingList().then(function (response) {
      $scope.shoppingList = response.data;
  }, function (err) {
      console.log(err.data);
  });
}
