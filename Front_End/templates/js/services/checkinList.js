var app = angular.module("catthings_app");

//==============Service to manage check in=================
app.factory('checkinList', ['$rootScope', checkinList]);
function checkinList ($rootScope) {
  var toCheckin = [];
  return {
      getCheckin: function () {
          return toCheckin;
      },
      addToCheckin: function(item) {
        var doesExist = false;
        //Make sure it's not in checkin
        for(var i = 0; i < toCheckin.length; i++){
          if (toCheckin[i].item_id === item.item_id){
            doesExist = true;
          }
        }
          if(doesExist == false){
            toCheckin.push(item);
            $rootScope.$broadcast("CheckinAdd", toCheckin);
          }
      },
      removeSelected: function(){
        var newCheckin=[];
        var toUncheck=[];
            angular.forEach(toCheckin,function(item){
              if(!item.uncheckin){
                newCheckin.push(item);
              }
              else{
                toUncheck.push(item.item_id); //Push item id to uncheck in inventory
              }
            });
        toCheckin=newCheckin;
        $rootScope.$broadcast("CheckinUncheck", toUncheck);
        return toCheckin;
      },
      removeFromCheckin: function(item){
        for(var i = 0; i < toCheckin.length; i++){
          if (toCheckin[i].item_id == item.item_id){
            toCheckin.splice(i, 1);
            break;
          }
        }
        $rootScope.$broadcast("RemoveCheckin", toCheckin);
      }
    }
}
