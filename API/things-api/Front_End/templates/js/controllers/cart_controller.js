/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for controlling the Cart table that is
displayed when users are checking out items from theinventory.
*/

var app = angular.module("catthings_app");

//============Cart Controller============
app.controller('CartController', ['$scope', '$http',  '$location', '$rootScope', 'cartList', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'thingsAPI', 'inventoryList', '$q', '$window', CartController]);
function CartController($scope, $http,  $location, $rootScope, cartList, DTOptionsBuilder, DTColumnDefBuilder, thingsAPI, inventoryList, $q, $window){
  //Initialization
  $scope.cart = []; //Cart array which contains list of items that user wants to check out.
  $scope.userName = 'Anonymous'; //Set default user name
  $scope.dtOptions = { //Datatables Initialization
     paging: true,
     searching: true,
     info: false
  };

  //Display the empty name error since no name has been entered.
  $scope.emptyNameError = true;

  /*
  Check whether there are items in the cart and then display either the cart
  datatable or the message saying that the cart is empty.
  */
  function check(){
    if(!$scope.cart.length){
      $scope.cartNotEmpty = false;
      $scope.cartEmpty = true;
    }
    else{
      $scope.cartNotEmpty = true;
      $scope.cartEmpty = false;
    }
  }

  /*
  When an item has been added to the cart, the factory will broadcast that an
  item has been added. This will catch the broadcast with the message "CartAdd"
  and then set the current cart to the updated Cart contents, thus updating the
  Cart datatable.
  */
  $scope.$on("CartAdd", function(event, newCart){
    $scope.cart = newCart;
    check();
  });

  /*
  When an item has been removed from the cart, the factory will broadcast that
  an item has been removed. This will catch the broadcast with the message
  "RemoveCart" and then set the current cart to the updated Cart contents, thus
  updating the Cart datatable.
  */
  $scope.$on("RemoveCart", function(event, newCart){
    $scope.cart = newCart;
    check();
  });

  /*
  This function checks whether a name has been entered in the name input field
  and display the error message if not.
  */
  $scope.checkName = function(){
    //Name is undefined
    if(angular.isUndefined($scope.userName)){
      $scope.emptyNameError = true;
      return true;
    }
    else{ //No name has been entered
      if($scope.userName.length == 0){
        $scope.emptyNameError = true;
        return true;
      }
      else{ //Name has been entered
        $scope.emptyNameError = false;
        return false;
      }
    }
  }

  /*
  This function checks the quantities entered for checkout for each item. If
  there are any errors, an error message will display under the item(s) with
  the source of error(s). This function is used to enable/disable the checkout
  button.
  */
  $scope.checkQuantity = function(){
    for(var i = 0; i < $scope.cart.length; i++){
      //Not all items have selected quantities
      if($scope.cart[i].selectedQuantity == null){
        return true;
      }
      //Quantity entered is 0
      if($scope.cart[i].selectedQuantity == 0){
        $scope.cart[i].zeroQuantity = true;
        $scope.cart[i].errorQuantity = false;
        $scope.cart[i].negativeQuantity = false;
        return true;
      }
      //Quantity greater than available
      if($scope.cart[i].selectedQuantity > parseInt($scope.cart[i].quantity)){
        $scope.cart[i].zeroQuantity = false;
        $scope.cart[i].errorQuantity = true;
        $scope.cart[i].negativeQuantity = false;
        return true;
      }
      //Negative Quantity
      if($scope.cart[i].selectedQuantity < 0){
        $scope.cart[i].zeroQuantity = false;
        $scope.cart[i].errorQuantity = false;
        $scope.cart[i].negativeQuantity = true;
        return true;
      }
      //No errors
      $scope.cart[i].errorQuantity = false;
      $scope.cart[i].negativeQuantity = false;
      $scope.cart[i].zeroQuantity = false;
    }
    return false;
  }

  /*
  This function removes selected items from cart by utilizing the cart list
  factory which is in charge of the cart data.
  */
  $scope.removeSelected = function() {
    $scope.cart = cartList.removeSelected();
    check();
  }

  /*
  This function performs the checkout of selected items once it passes the
  error checking. Since AngularJS performs asynchronous operations, the use of
  promises is essential. Once all promises have been resolved, error checking
  is done to ensure that all API calls went through. Any that did not will be
  displayed. Then, the cart table will be reset and the inventory table will be
  updated to display the newer quantities.
  */
  $scope.checkOut = function() {
    var promises = [];

    //Name is undefined so set to default name
    if(angular.isUndefined($scope.userName) || $scope.userName.length == 0){
      $scope.userName = 'Anonymous';
    }

    for(var i = 0; i < $scope.cart.length; i++){
      promises.push(thingsAPI.checkout($scope.cart[i].item_id, $scope.userName, $scope.cart[i].selectedQuantity));
    }

    //Once all promises are completed (i.e. all API calls are done)
    $q.all(promises).then(function(results){
      var failed = [];
      for(var j = 0; j < results.length; j++){
        if(results[j].success == false){
          console.log("Unable to check out " + inventoryList.getItemName(results[j].item_id));
          failed.push(inventoryList.getItemName(results[j].item_id));
        }
      }
      //Display any error messages
      if(failed.length > 0){
        $window.alert("Unable to check out the following item(s):\n" + failed);
      }
      else{ //Display success message
        $window.alert("All items successfully checked out!");
      }
      //Update inventory with new quantities
      thingsAPI.getView().then(function(response) {
        inventoryList.setInventory(response.data);
        $scope.cart.length = 0;
        $scope.cartEmpty = true;
        $scope.cartNotEmpty = false;
      });
    });
  }
}
