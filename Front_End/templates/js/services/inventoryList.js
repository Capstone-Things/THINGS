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
  obj.setInventory = (newInventory) => {inventory = newInventory;}

  //Get item name using item_id
  obj.getItemName = (item_id) => {
    for(var i = 0; i < inventory.length; i++){
      if (inventory[i].item_id == item_id){
        return inventory[i].name;
      }
    }
    return "No item found";
  }
  return obj;
}
