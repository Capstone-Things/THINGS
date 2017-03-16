var app = angular.module("catthings_app");
//=============Shopping List Controller=================
app.controller('ShoppingListController', ['$scope', '$http', 'thingsAPI', 'DTOptionsBuilder' , ShoppingListController]);
function ShoppingListController($scope, $http, thingsAPI, DTOptionsBuilder) {


    $scope.dtOptions = new DTOptionsBuilder.newOptions()
                        .withDOM('rtp')
                        .withDisplayLength("50")
                        .withButtons(['print']);

    //Get latest inventory data from database
  thingsAPI.getShoppingList().then(function (response) {
      $scope.shoppingList = response.data;

  }, function (err) {

      console.log(err.data);
  });
}
