/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code maintaining the Checkin Table factory.
Factories allow the checkin table data to be shared between multiple controllers
in a neat fashion.
*/
var app = angular.module("catthings_app");

app.factory('checkinList', ['$rootScope', checkinList]);
function checkinList ($rootScope) {
  var toCheckin = [];
  return {
      //Return checkin data
      getCheckin: function () {
          return toCheckin;
      },
      //Add to checkin array
      addToCheckin: function(item) {
        var doesExist = false;
        //Make sure it's not in checkin
        for(var i = 0; i < toCheckin.length; i++){
          if (toCheckin[i].item_id === item.item_id){
            doesExist = true;
          }
        }
          //Add to checkin array if not already there
          if(doesExist == false){
            toCheckin.push(item);
            $rootScope.$broadcast("CheckinAdd", toCheckin);
          }
      },
      //Remove all selected from the checkin array
      removeSelected: function(){
        var newCheckin=[];
        var toUncheck=[];
            angular.forEach(toCheckin,function(item){
              if(!item.uncheckin){
                newCheckin.push(item);
              }
              else{ //Push item id to uncheck in inventory
                toUncheck.push(item.item_id);
              }
            });
        toCheckin=newCheckin;
        //Broadcast that items have been removed
        $rootScope.$broadcast("CheckinUncheck", toUncheck);
        return toCheckin;
      },
      //Remove from checkin array an item if it exists
      removeFromCheckin: function(item){
        for(var i = 0; i < toCheckin.length; i++){
          if (toCheckin[i].item_id == item.item_id){
            toCheckin.splice(i, 1);
            break;
          }
        }
        //Broadcast that an item has been removed
        $rootScope.$broadcast("RemoveCheckin", toCheckin);
      }
    }
}
