/*global angular*/
var app = angular.module("catthings_app", ['ui.bootstrap', 'ngMockE2E', 'ui.router']);

//UI Router Config
app.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

    // For any unmatched url, send to /index
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('login', {
          url: "/",
          templateUrl: 'templates/html/login.html',
          controller: "LoginCheckController"
        })
        .state('home', {
          url: "/home",
          templateUrl: 'templates/html/home.html'
        })
        .state('request',{
          url: "/request",
          templateUrl: 'templates/html/request.html'
        });
   $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     'https://things.cs.pdx.edu/**'
   ]);
});

//Login Controller
app.controller('LoginCheckController', ['$scope', '$location','$rootScope','$http', LoginCheckController]);
function LoginCheckController($scope, $location, $rootScope, $http) {
    // Can be used for Admin login
    $rootScope.baseURL = "https://things.cs.pdx.edu:3000/";
    $scope.user = {};

    $scope.showAdminLogin = false;
    $scope.LoginCheck = function() {
      var loginData = $scope.user

      $http.post( $rootScope.baseURL + 'authenticate', loginData).then(function(response){
        if(response.status == 200){
          console.log(response);
          console.log(response.headers);
          $rootScope.username = response.headers('username');
          $rootScope.isAdmin = response.headers('admin');
          $rootScope.token = response.headers('token');
        };
      });
      $rootScope.username = $scope.username;
      $location.path("home");

    };

    $scope.SetAdminLogin = function() {
      $scope.showAdminLogin = !$scope.showAdminLogin;
    }
}

//==============Service to manage cart=================
app.service('cartList', ['$rootScope', cartList]);
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

//=============NavBar Controller=================
app.controller('NavBarController', ['$scope', NavBarController]);
function NavBarController($scope) {
    $scope.isCollapsed = true;
}

//=============Inventory Controller===============
app.controller('InventoryController', ['$scope', '$http', '$rootScope', '$uibModal', '$location', 'cartList', InventoryController]);
function InventoryController($scope, $http, $uibModal, $location, $rootScope, cartList) {
  $rootScope.baseURL = 'https://things.cs.pdx.edu:3000/';
  //Get latest inventory data from database
  $http.get($rootScope.baseURL +'view')
  .then(function (response) {
      $scope.inventory = response.data;
  });

  $scope.addToCart = function(item){
    if(item.carted == true){ //Checked
      //Make copy of the item to add to cart
      var cartItem = angular.copy(item);
      cartItem.check = false;
      cartList.addToCart(cartItem);
    }
    else{ //Unchecked
      cartList.removeFromCart(item);
    }
  }

  //Uncheck items in inventory table that have been removed from Cart
  $scope.$on("Uncheck", function(event, toUncheck){
    for(var i = 0; i < toUncheck.length; i++){
      for(var j = 0; j < $scope.inventory.length; j++){
        if ($scope.inventory[j].item_id == toUncheck[i]){
          $scope.inventory[j].carted = false;
        }
      }
    }
  });
}

//============Cart Controller============
app.controller('CartController', ['$scope', '$http', '$uibModal', '$location', '$rootScope', 'cartList', CartController]);
function CartController($scope, $http, $uibModal, $location, $rootScope, cartList){

  //Initialization purposes
  $scope.cart = [];
  function check(){
    if(!$scope.cart.length){
      $scope.cartNotEmpty = false;
      $scope.cartEmpty = true;
    }
    else{
      $scope.cartNotEmpty = true;
      $scope.cartEmpty = false;
    }
  }
  check()

  //Broadcast for when items are added to Cart
  $scope.$on("CartAdd", function(event, newCart){
    $scope.cart = newCart;
    check();
  });

  //Broadcast for when item is removed from cart in Inventory list
  $scope.$on("RemoveCart", function(event, newCart){
    $scope.cart = newCart;
    check();
  });

  //Check Quantity
  $scope.checkQuantity = function(){
    for(var i = 0; i < $scope.cart.length; i++){
      if($scope.cart[i].selectedQuantity == null){ //Not all items have selected quantities
        return true;
      }
      if($scope.cart[i].selectedQuantity == 0){ //Quantity entered is 0
        $scope.cart[i].zeroQuantity = true;
        $scope.cart[i].errorQuantity = false;
        $scope.cart[i].negativeQuantity = false;
        return true;
      }
      if($scope.cart[i].selectedQuantity > parseInt($scope.cart[i].quantity)){ //Quantity greater than available
        $scope.cart[i].zeroQuantity = false;
        $scope.cart[i].errorQuantity = true;
        $scope.cart[i].negativeQuantity = false;
        return true;
      }
      if($scope.cart[i].selectedQuantity < 0){ //Negative Quantity
        $scope.cart[i].zeroQuantity = false;
        $scope.cart[i].errorQuantity = false;
        $scope.cart[i].negativeQuantity = true;
        return true;
      }
      //All good
      $scope.cart[i].errorQuantity = false;
      $scope.cart[i].negativeQuantity = false;
      $scope.cart[i].zeroQuantity = false;
    }
    return false;
  }

  //Remove selected items from cart
  $scope.removeSelected = function() {
    $scope.cart = cartList.removeSelected();
    check();
  }

  //Checkout
  $scope.checkOut = function() {
    console.log($rootScope.username);
    console.log($scope.cart.id);
    console.log($scope.cart.quantity);
    $http.post('/checkout', $scope.cart).then(function(response){
      console.log(response.status);
      if(response.status === 200){
              $location.path("home");
      }
      //Else 404 error....Could need another modal
    });
  }
}

//  $http.get("http://things.cs.pdx.edu:3000/view").then(function (response) {
app.run(function ($httpBackend) {
    var inventory = [{name: 'Pop Tarts', description: 'Yummy', quantity: '5'}, {name: 'Kool-Aid', description: 'Oh Yeah', quantity: '10'}, {name: 'Printer Ink', description: 'Ink for printer', quantity: '30'}];

    //returns the current inventory list
    $httpBackend.whenGET('/view').respond(inventory);

    //Checkout items
    $httpBackend.whenPOST('/checkout').respond(function(method, url, data) {
        data = JSON.parse(data);
        for (var i = 0; i < data.length; i++){
          for (var j = 0; j < inventory.length; j++){
            if (inventory[j].name === data[i].name){
              console.log(inventory[j].quantity);
              inventory[j].quantity = (parseInt(inventory[j].quantity) - data[i].quantity).toString();
              console.log(inventory[j].quantity);
              break;
            }
          }
        }
        return [200, {}, {}];
    });

    $httpBackend.whenGET('templates/html/login.html').passThrough();
    $httpBackend.whenGET('templates/html/home.html').passThrough();
    $httpBackend.whenGET('templates/html/cart.html').passThrough();
    $httpBackend.whenGET('templates/html/request.html').passThrough();
    $httpBackend.whenGET('templates/html/promptQuantity.html').passThrough();

    $httpBackend.whenGET("http://localhost:3000/view").passThrough();
    $httpBackend.whenJSONP(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenGET(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenPOST(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenPOST(/https:\/\/localhost:3000\/*/).passThrough();
});
