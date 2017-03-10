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

  //Checkout: Add to Cart
  $scope.addToCart = function(item){
    var cartItem = angular.copy(item);
    cartItem.check = false;
    cartItem.selectedQuantity = 1;
    cartList.addToCart(cartItem);
    /*
      if(item.carted == true){ //Checked
        //Make copy of the item to add to cart
        var cartItem = angular.copy(item);
        cartItem.check = false;
        cartList.addToCart(cartItem);
      }
      else{ //Unchecked
        cartList.removeFromCart(item);
      }
      */
    }

    //Uncheck items in inventory table that have been removed from Cart
    $scope.$on("Uncheck", function(event, toUncheck){
      for(var i = 0; i < toUncheck.length; i++){
        for(var j = 0; j < $scope.inventory.length; j++){
          if ($scope.inventory[j].item_id == toUncheck[i]){
            $scope.inventory[j].carted = false;
          }
        }
      }
    });

    //Watch for inventory changes
    $scope.$watch(function(){return inventoryList.getInventory()},
      function(newValue, oldValue){
        $scope.inventory = newValue;
    });
}
