var app = angular.module("catthings_app");
//=============Shopping List Controller=================
app.controller('ShoppingListController', ['$scope', '$http', ShoppingListController]);
function ShoppingListController($scope, $http) {
  //Get latest inventory data from database
  $http.get("https://things.cs.pdx.edu:3000/api/shoppinglist")
  .success(function (data) {
      $scope.shoppingList = data;
  }, function (err) { 
      console.log(err);
  });
}
