var app = angular.module("catthings_app");

//==============Service to manage cart=================
app.factory('cartList', ['$rootScope', cartList]);
function cartList ($rootScope) {
  var cart = [];
  return {
      getCart: function () {
          return cart;
      },
      addToCart: function(item) {
        var doesExist = false;
        //Make sure it's not in cart
        for(var i = 0; i < cart.length; i++){
          if (cart[i].item_id === item.item_id){
            doesExist = true;
          }
        }
          if(doesExist == false){
            cart.push(item);
            $rootScope.$broadcast("CartAdd", cart);
          }
      },
      removeSelected: function(){
        var newCart=[];
        var toUncheck=[];
            angular.forEach(cart,function(item){
              if(!item.checked){
                newCart.push(item);
              }
              else{
                toUncheck.push(item.item_id); //Push item id to uncheck in inventory
              }
            });
        cart=newCart;
        $rootScope.$broadcast("Uncheck", toUncheck);
        return cart;
      },
      removeFromCart: function(item){
        for(var i = 0; i < cart.length; i++){
          if (cart[i].item_id == item.item_id){
            cart.splice(i, 1);
            break;
          }
        }
        $rootScope.$broadcast("RemoveCart", cart);
      }
  };
}
