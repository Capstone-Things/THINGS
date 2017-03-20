/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for checking in items, displaying an up
to date inventory.
*/

var app = angular.module("catthings_app");

app.controller('CheckInController', ['$scope', '$http', '$location', '$rootScope', 'inventoryList', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'thingsAPI', 'checkinList', '$q', '$window', CheckInController]);
function CheckInController($scope, $http, $location, $rootScope, inventoryList, DTOptionsBuilder, DTColumnDefBuilder, thingsAPI, checkinList, $q, $window){
  //Initialization Variables
  $scope.checkin=[]; //Check in
  $scope.person={}; //Name of person
  //Datatable Initialization
  $scope.searchQuery = '';
  $scope.emptyNameError = true;
  $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('sDom', 'rtip');


  //Get latest inventory data from database
  thingsAPI.getView().then(function (response) {
      inventoryList.setInventory(response.data);
      $scope.stuff=inventoryList.getInventory();
  });

  /*
  This function checks whether there are items in the checkin table and then
  display either the checkin datatable or the message saying that the table is
  empty.
  */
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

  /*
  This function adds item from the inventory table to the checkin table by
  utilizing the checkin factory.
  */
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

  /*
  This function removes all selected items from the checkin table.
  */
  $scope.removeSelected = function() {
    $scope.checkin = checkinList.removeSelected();
    check();
  }

  /*
  This function checks whether a name has been entered in the name input field
  and display the error message if it has not been.
  */
  $scope.checkPerson = function(){
    //Name is undefined
    if(angular.isUndefined($scope.person.name)){
      $scope.emptyNameError = true;
    }
    else{ //No name has been entered
      if($scope.person.name.length == 0){
        $scope.emptyNameError = true;
      }
      else{ //Name has been entered
        $scope.emptyNameError = false;
      }
    }
  }

  /*
  This function checks if all information entered and selected are valid. If
  there are errors, it will return true which disables the checkin button.
  Otherwise, it will enable the checkin button.
  */
  $scope.checkCheckin = function(){
    if($scope.emptyNameError == true){
      if(angular.isUndefined($scope.person.name)){
        return true;
      }
    }
    for(var i = 0; i < $scope.checkin.length; i++){
      //Not all items have selected quantities
      if($scope.checkin[i].selectedQuantity == null){
        return true;
      }
      //Quantity entered is 0
      if($scope.checkin[i].selectedQuantity == 0){
        $scope.checkin[i].zeroQuantity = true;
        $scope.checkin[i].negativeQuantity = false;
        return true;
      }
      //Negative Quantity
      if($scope.checkin[i].selectedQuantity < 0){
        $scope.checkin[i].zeroQuantity = false;
        $scope.checkin[i].negativeQuantity = true;
        return true;
      }
      //No errors
      $scope.checkin[i].negativeQuantity = false;
      $scope.checkin[i].zeroQuantity = false;
    }
    return false;
  }

  /*
  This function checks in the items in the checkin table. Since AngularJS
  performs asynchronous operations, the use of promises is essential. Once all
  promises have been resolved, error checking is done to ensure that all API
  calls went through. Any that did not will be displayed. Then, the checin table
  will be reset and the inventory table will be updated to display the newer
  quantities.
  */
  $scope.confirm = function(){
    var promises = [];
    for(var i = 0; i < $scope.checkin.length; i++){
      promises.push(thingsAPI.checkin($scope.checkin[i].item_id, $scope.person, $scope.checkin[i].selectedQuantity));
    }

    $q.all(promises).then(function(results){
      var failed = [];
      for(var j = 0; j < results.length; j++){
        console.log(results[j]);
        if(results[j].success == false){
          console.log("Unable to check in " + inventoryList.getItemName(results[j].item_id));
          failed.push(inventoryList.getItemName(results[j].item_id));
        }
      }
      //Display any error messages
      if(failed.length > 0){
        $window.alert("Unable to check in the following item(s):\n" + failed);
      }
      else{ //Display success message
        $window.alert("All items successfully checked in!");
      }
      //Update inventory with new quantities
      thingsAPI.getView().then(function(response) {
        inventoryList.setInventory(response.data);
        $scope.stuff=inventoryList.getInventory();
        $scope.checkin.length = 0; //Bizare way to clear array
        $scope.checkinEmpty = true;
        $scope.checkinNotEmpty = false;
      });
    });
  }

  /*
  When an item has been added to the checkin table, the checkin factory will
  broadcast that an item has been added. This will catch that broadcast and
  update the checkin array.
  */
  $scope.$on("CheckinAdd", function(event, toCheckin){
    $scope.checkin = toCheckin;
    check();
  });

  /*
  When an item has been removed from the checkin table, the checkin factory will
  broadcast that an item has been removed. This will catch that broadcast and
  update the checkin array.
  */
  $scope.$on("RemoveCheckin", function(event, toCheckin){
    $scope.checkin = toCheckin;
    check();
  });

  /*
  When items have been removed from the checkin factory, this will uncheck the
  items that were removed from the factory and update the inventory view.
  */
  $scope.$on("CheckinUncheck", function(event, toUncheck){
    for(var i = 0; i < toUncheck.length; i++){
      for(var j = 0; j < $scope.stuff.length; j++){
        if ($scope.stuff[j].item_id == toUncheck[i]){
          $scope.stuff[j].checkin = false;
        }
      }
    }
  });
}
