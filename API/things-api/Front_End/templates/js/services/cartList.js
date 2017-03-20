/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code maintaining the Cart Table factory.
Factories allow the cart table data to be shared between multiple controllers in
a neat fashion.
*/
var app = angular.module("catthings_app");

app.factory('cartList', ['$rootScope', cartList]);
function cartList ($rootScope) {
  var cart = [];
  return {
      //Returns the cart
      getCart: function () {
          return cart;
      },
      //Adds to the cart
      addToCart: function(item) {
        var doesExist = false;
        //Increase checkout quantity by 1 if already in cart
        for(var i = 0; i < cart.length; i++){
          if (cart[i].item_id === item.item_id){
            if(cart[i].selectedQuantity < cart[i].quantity){
              cart[i].selectedQuantity = cart[i].selectedQuantity + 1;
            }
            doesExist = true;
          }
        }
          if(doesExist == false){ //Otherwise add to cart
            cart.push(item);
            $rootScope.$broadcast("CartAdd", cart);
          }
      },
      //Remove all selected items from the cart
      removeSelected: function(){
        var newCart=[];
        var toUncheck=[];
            angular.forEach(cart,function(item){
              if(!item.checked){
                newCart.push(item);
              }
              else{ //Push item id to uncheck in inventory
                toUncheck.push(item.item_id);
              }
            });
        cart=newCart;
        //Broadcast that the items have been removed from the cart
        $rootScope.$broadcast("Uncheck", toUncheck);
        return cart; //Return the cart
      },
      //Remove an item from the cart
      removeFromCart: function(item){
        for(var i = 0; i < cart.length; i++){
          if (cart[i].item_id == item.item_id){
            cart.splice(i, 1);
            break;
          }
        }
        //Broadcast that an item as been removed
        $rootScope.$broadcast("RemoveCart", cart);
      }
  };
}
