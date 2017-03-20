/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code maintaining the inventory factory.
Factories allow the inventory table data to be shared between multiple
controllers in a neat fashion.
*/

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
