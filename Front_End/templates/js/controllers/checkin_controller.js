var app = angular.module("catthings_app");

app.controller('CheckInController', ['$scope', '$http',  '$location', '$rootScope', 'inventoryList', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'thingsAPI', 'checkinList', CheckInController]);
function CheckInController($scope, $http,  $location, $rootScope, inventoryList, DTOptionsBuilder, DTColumnDefBuilder, thingsAPI, checkinList){
  $scope.checkin=[];
  $scope.person={};
  $scope.searchQuery = '';
  $scope.emptyNameError = false;
  $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('sDom', 'rtip');

  $scope.dtColumns = [
    DTColumnDefBuilder.newColumnDef(0).withOption('searchable', false),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2).withOption('searchable', false),
    DTColumnDefBuilder.newColumnDef(3).withOption('searchable', false)
  ]

  $scope.dtInstanceCallback = function(dtInstance){
    $scope.dti = dtInstance;
  };

  $scope.searchTable = function(){
    if($scope.searchQuery == null){
      $scope.dti.DataTable.search("").draw();
    }
    else{
      $scope.dti.DataTable.search($scope.searchQuery);
      $scope.dti.DataTable.search($scope.searchQuery).draw();
    }
  };

  //Get latest inventory data from database
  thingsAPI.getView().then(function (response) {
      inventoryList.setInventory(response.data);
      $scope.stuff=inventoryList.getInventory();
  });

  function check(){
    if($scope.checkin.length == 0){
      $scope.checkinNotEmpty = false;
      $scope.checkinEmpty = true;
    }
    else{
      $scope.checkinNotEmpty = true;
      $scope.checkinEmpty = false;
    }
  };
  check();

  //Checkin- Add to checkin
  $scope.addToCheckin = function(item){
    if(item.checkin == true){ //Checked
      //Make copy of the item to add to checkin
      var checkinItem = angular.copy(item);
      checkinItem.uncheckin = false;
      checkinList.addToCheckin(checkinItem);
    }
    else{ //Unchecked
      checkinList.removeFromCheckin(item);
    }
  }

  //Remove selected items from checkin
  $scope.removeSelected = function() {
    $scope.checkin = checkinList.removeSelected();
    check();
  }

  //Check name
  $scope.checkPerson = function(){
    if(angular.isUndefined($scope.person.name)){
      $scope.emptyNameError = true;
    }
    else{
      if($scope.person.name.length == 0){
        $scope.emptyNameError = true;
      }
      else{
        $scope.emptyNameError = false;
      }
    }
  }

  //Check Quantity
  $scope.checkCheckin = function(){
    if($scope.emptyNameError == true){
      if(angular.isUndefined($scope.person.name)){
        console.log("Returning TRUE");
        return true;
      }
    }
    for(var i = 0; i < $scope.checkin.length; i++){
      if($scope.checkin[i].selectedQuantity == null){ //Not all items have selected quantities
        return true;
      }
      if($scope.checkin[i].selectedQuantity == 0){ //Quantity entered is 0
        $scope.checkin[i].zeroQuantity = true;
        $scope.checkin[i].negativeQuantity = false;
        return true;
      }
      if($scope.checkin[i].selectedQuantity < 0){ //Negative Quantity
        $scope.checkin[i].zeroQuantity = false;
        $scope.checkin[i].negativeQuantity = true;
        return true;
      }
      //All good
      $scope.checkin[i].negativeQuantity = false;
      $scope.checkin[i].zeroQuantity = false;
    }
    return false;
  }

  //Check In
  $scope.confirm = function(){
    console.log($scope.checkin);
    thingsAPI.checkin($scope.checkin[0].item_id, $scope.person, $scope.checkin[0].selectedQuantity)
    .then(function(response){
      console.log(response);
      console.log(response.status);
      console.log(response.data);
      if(response.status === 200){
        thingsAPI.getView().then(function (response) {
            inventoryList.setInventory(response.data);
            $scope.stuff=inventoryList.getInventory();
            $scope.dti.rerender();
        });
      }
      //Else 404 error....Could need another modal
    });
  }

  //Broadcast for when items are added to Checkin
  $scope.$on("CheckinAdd", function(event, toCheckin){
    $scope.checkin = toCheckin;
    check();
  });

  //Broadcast for when item is removed from checkin in Inventory list
  $scope.$on("RemoveCheckin", function(event, toCheckin){
    $scope.checkin = toCheckin;
    check();
  });

  //Uncheck items in inventory table that have been removed from checkin
  $scope.$on("CheckinUncheck", function(event, toUncheck){
    for(var i = 0; i < toUncheck.length; i++){
      for(var j = 0; j < $scope.stuff.length; j++){
        if ($scope.stuff[j].item_id == toUncheck[i]){
          $scope.stuff[j].checkin = false;
        }
      }
    }
  });

/*
  //Watch for inventory changes
  $scope.$watch(function(){return inventoryList.getInventory()},
    function(newValue, oldValue){
      $scope.stuff = newValue;
  });
  */
}
