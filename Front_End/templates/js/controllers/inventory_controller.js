var app = angular.module('catthings_app');

//Inventory Controller
app.controller('InventoryController', ['$scope', '$http',  '$location', 'cartList', InventoryController]);
function InventoryController($scope, $http,  $location, cartList) {
  //Get latest inventory data from database
  $http.get("https://things.cs.pdx.edu:3000/view").then(function (response) {
      $scope.inventory = response.data;
      console.log($scope.inventory);
  });

  $scope.addToCart = function(item){
      if(item.carted == true){ //Checked
        //Make copy of the item to add to cart
        var cartItem = angular.copy(item);
        cartItem.check = false;
        cartList.addToCart(cartItem);
      }
      else{ //Unchecked
        cartList.removeFromCart(item);
      }
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

}
