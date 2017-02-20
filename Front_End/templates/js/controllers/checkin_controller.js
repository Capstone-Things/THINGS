var app = angular.module("catthings_app");

app.controller('CheckInController', ['$scope', '$http',  '$location', '$rootScope', 'inventoryList', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'thingsAPI', CheckInController]);
function CheckInController($scope, $http,  $location, $rootScope, inventoryList, DTOptionsBuilder, DTColumnDefBuilder, thingsAPI){

  $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('sDom', 'rtip');

  //Get latest inventory data from database
  thingsAPI.getView().then(function (response) {
      inventoryList.setInventory(response.data);
      $scope.stuff=inventoryList.getInventory();
      console.log($scope.stuff);
  });
}
