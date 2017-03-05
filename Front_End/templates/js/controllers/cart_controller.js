var app = angular.module("catthings_app");

//============Cart Controller============
app.controller('CartController', ['$scope', '$http',  '$location', '$rootScope', 'cartList', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'thingsAPI', 'inventoryList', CartController]);
function CartController($scope, $http,  $location, $rootScope, cartList, DTOptionsBuilder, DTColumnDefBuilder, thingsAPI, inventoryList){

  //Initialization purposes
  $scope.cart = [];
  $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('sDom', 'rtip');
  $scope.emptyNameError = true;

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
  check()

  //Broadcast for when items are added to Cart
  $scope.$on("CartAdd", function(event, newCart){
    $scope.cart = newCart;
    check();
  });

  //Broadcast for when item is removed from cart in Inventory list
  $scope.$on("RemoveCart", function(event, newCart){
    $scope.cart = newCart;
    check();
  });

  //Check name
  $scope.checkName = function(){
    if(angular.isUndefined($scope.userName)){
      $scope.emptyNameError = true;
      return true;
    }
    else{
      if($scope.userName.length == 0){
        $scope.emptyNameError = true;
        return true;
      }
      else{
        $scope.emptyNameError = false;
        return false;
      }
    }
  }

  //Check Quantity
  $scope.checkQuantity = function(){
    if(angular.isUndefined($scope.userName)){
      $scope.emptyNameError = true;
      return true;
    }
    else{
      if($scope.userName.length == 0){
        $scope.emptyNameError = true;
        return true;
      }
      else{
        $scope.emptyNameError = false;
      }
    }
    for(var i = 0; i < $scope.cart.length; i++){
      if($scope.cart[i].selectedQuantity == null){ //Not all items have selected quantities
        return true;
      }
      if($scope.cart[i].selectedQuantity == 0){ //Quantity entered is 0
        $scope.cart[i].zeroQuantity = true;
        $scope.cart[i].errorQuantity = false;
        $scope.cart[i].negativeQuantity = false;
        return true;
      }
      if($scope.cart[i].selectedQuantity > parseInt($scope.cart[i].quantity)){ //Quantity greater than available
        $scope.cart[i].zeroQuantity = false;
        $scope.cart[i].errorQuantity = true;
        $scope.cart[i].negativeQuantity = false;
        return true;
      }
      if($scope.cart[i].selectedQuantity < 0){ //Negative Quantity
        $scope.cart[i].zeroQuantity = false;
        $scope.cart[i].errorQuantity = false;
        $scope.cart[i].negativeQuantity = true;
        return true;
      }
      //All good
      $scope.cart[i].errorQuantity = false;
      $scope.cart[i].negativeQuantity = false;
      $scope.cart[i].zeroQuantity = false;
    }
    return false;
  }

  //Remove selected items from cart
  $scope.removeSelected = function() {
    $scope.cart = cartList.removeSelected();
    check();
  }

  //Checkout
  $scope.checkOut = function() {
    var loopPromises = [];

    for(var i = 0; i < $scope.cart.length; i++){
      //$http.post('/checkout', $scope.cart)
      thingsAPI.checkout($scope.cart[i].item_id, $scope.userName, $scope.cart[i].selectedQuantity)
      .then(function(response){
        //Everything went smoothly
        if(response.status === 200){
          return;
        }

        //Bad Request
        /*
        if(response.status === 400){

        }

        //Forbidden
        if(response.status === 403){

        }
        */
      });
    }

    //Update inventory with new quantities
    thingsAPI.getView().then(function (response) {
      inventoryList.setInventory(response.data);
    });

  }
}
