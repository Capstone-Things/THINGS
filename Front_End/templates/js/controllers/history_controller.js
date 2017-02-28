var app = angular.module('catthings_app');

//Inventory Controller
app.controller('HistoryController', ['$scope', '$http',  '$location', 'thingsAPI', 'historyList', historyController]);
function HistoryController($scope, $http,  $location, thingsAPI, historyList) {
  //empty history list
  $scope.history = historyList.getHistory();

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

    //Watch for inventory changes
    $scope.$watch(function(){return inventoryList.getInventory()},
      function(newValue, oldValue){
        $scope.inventory = newValue;
    });
}
