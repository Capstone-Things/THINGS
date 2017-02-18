var app = angular.module("catthings_app");

//============Cart Controller============
app.controller('CartController', ['$scope', '$http',  '$location', '$rootScope', 'cartList', 'DTOptionsBuilder', 'DTColumnDefBuilder', CartController]);
function CartController($scope, $http,  $location, $rootScope, cartList, DTOptionsBuilder, DTColumnDefBuilder){

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
    console.log($rootScope.username);
    console.log($scope.cart.id);
    console.log($scope.cart.quantity);
    $http.post('/checkout', $scope.cart).then(function(response){
      console.log(response.status);
      if(response.status === 200){
              $location.path("home");
              //$scope.apply();
      }
      //Else 404 error....Could need another modal
    });
  }
}
