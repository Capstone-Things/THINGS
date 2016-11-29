var app = angular.module("checkout_app", []); 
app.controller("checkout_ctrl", function ($scope) {
    $scope.items = {
      0:{
          id: 0,
          item_name: "Pop Tarts",
          quantity: 50,
          description: "Delicous breakfast pastry",
          tags:["snacks", "pantry"]
      },
      1:{
          id: 1,
          item_name: "Printer Ink",
          quantity: 100,
          description: "Black printer ink for HP-1050",
          tags:["ink", "printer supply"]
      }      
        };
    
    $scope.cart = [];
    
    $scope.addToCart = function($scope, id){
       # $scope.cart.push({item_name: $scope.items[id].item_name, quantity: 1});
        $scope.items[id].quantity -= 1;
    };
    
    $scope.removeFromCart = function($scope, item){
        delete item;
    };
    
    $scope.checkout = function($scope){
        console.log("CHeckout complete");
    };
});