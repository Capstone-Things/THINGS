var app = angular.module("catthings_app");

app.factory('inventoryList', [inventoryList]);
function inventoryList()
{
  var obj = {};  //object to return
  //Variables
  var inventory = [];

  //Get Inventory
  obj.getInventory = ()=>{return inventory;}

  //Set Inventory
  obj.setInventory = (newInventory) =>{inventory = newInventory;}
  return obj;
}
