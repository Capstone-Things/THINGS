var app = angular.module("catthings_app");

app.controller('CheckInController', ['$scope', '$http',  '$location', '$rootScope', 'inventoryList', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'thingsAPI', CheckInController]);
function CheckInController($scope, $http,  $location, $rootScope, inventoryList, DTOptionsBuilder, DTColumnDefBuilder, thingsAPI){
  $scope.checkin=[];
  $scope.searchQuery = '';
  $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('sDom', 'rtip', 'select');

  $scope.dtColumns = [
    DTColumnDefBuilder.newColumnDef(0).withOption('searchable', false),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2).withOption('searchable', false),
    DTColumnDefBuilder.newColumnDef(3).withOption('searchable', false)
  ]

  $scope.dtInstanceCallback = function(dtInstance){
    $scope.dtInstance = dtInstance;
  };

  $scope.searchTable = function(){
    if($scope.searchQuery == null){
      $scope.dtInstance.DataTable.search("").draw();
    }
    else{
      $scope.dtInstance.DataTable.search($scope.searchQuery);
      $scope.dtInstance.DataTable.search($scope.searchQuery).draw();
    }
  };

  //Get latest inventory data from database
  thingsAPI.getView().then(function (response) {
      inventoryList.setInventory(response.data);
      $scope.stuff=inventoryList.getInventory();
      console.log($scope.stuff);
  });

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

}
