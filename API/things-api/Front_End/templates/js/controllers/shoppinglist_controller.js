var app = angular.module("catthings_app");
//=============Shopping List Controller=================
app.controller('ShoppingListController', ['$scope', '$http', 'thingsAPI', ShoppingListController]);
function ShoppingListController($scope, $http, thingsAPI) {
  //Get latest inventory data from database
  thingsAPI.shoppingList()
  .success(function (data) {
      $scope.shoppingList = data;
  });
}
