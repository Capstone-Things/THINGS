var app = angular.module("catthings_app");

app.factory('historyList', [historyList]);
function historyList()
{
  var obj = {};  //object to return
  //Variables
  var history = [];

  //Get Inventory
  obj.getHistory = ()=>{return history;}

  //Set Inventory
  obj.setHistory = (newHistory) =>{history = newHistory;}
  return obj;
}
