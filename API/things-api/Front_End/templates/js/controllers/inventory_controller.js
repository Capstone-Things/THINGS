/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for displaying the inventory table as well
as to add to the checkout cart.
*/
var app = angular.module('catthings_app');

//Inventory Controller
app.controller('InventoryController', ['$scope', '$http',  '$location', 'cartList', 'thingsAPI', 'inventoryList', InventoryController]);
function InventoryController($scope, $http,  $location, cartList, thingsAPI, inventoryList) {
  //Get latest inventory data from database
  thingsAPI.getView().then(function (response) {
      inventoryList.setInventory(response.data);
      $scope.inventory=inventoryList.getInventory();
      console.log($scope.inventory);
  });

  /*
  This function adds an item from the inventory to the cart by utilizing the
  cartList factory.
  */
  $scope.addToCart = function(item){
    var cartItem = angular.copy(item);
    cartItem.check = false;
    cartItem.selectedQuantity = 1;
    cartList.addToCart(cartItem);
  }

  /*
  This watches any changes made to the inventory data in the inventoryList
  factory and updates the inventory table with the latest data.
  */
  $scope.$watch(function(){return inventoryList.getInventory()},
    function(newValue, oldValue){
      $scope.inventory = newValue;
  });
}
