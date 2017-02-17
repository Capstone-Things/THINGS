/*global angular*/
//var app = angular.module("catthings_app");
var app = angular.module("catthings_app",
  ['datatables','ui.bootstrap', 'ngMockE2E', 'ui.router']);
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
        })
        .state('shoppinglist',{
          url: "/shoppinglist",
          templateUrl: 'templates/html/shoppinglist.html'
        })
        .state('checkin', {
          url: "/checkin",
          templateUrl: 'templates/html/checkin.html'
        });
   $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     'https://things.cs.pdx.edu:3000/**'
   ]);
});

//This Factory will act as a global doorway to the THIGNS API, all controllers
//will have access to this service.
app.factory('thingsAPI', ['$http', function($http){
//private Variables
  var _admin = false;
  var _token = null;
  var _user = 'Guest';
  //For local dev mode comment out the first line and uncomment the second...
  var _urlBase = 'https://things.cs.pdx.edu:3000/';
  //var _urlBase = 'https://localhost:3000/';


  var obj = {}; //this is the object that will be handed to our controller.
//Methods

  //Getters
  obj.getUserName = ()=>{return _user;}
  obj.getBaseURL = () =>{return _urlBase;}
  obj.getAdmin = ()=>{return _admin;}

  //Setters
  obj.setToken = (token)=>{_token=token};
  obj.setUserName = (user)=>{_user=user};
  obj.setAdmin = (admin)=>{_admin=admin};

  //route calls
  obj.authenticate=(loginData)=>{
    return $http.post(_urlBase+'authenticate', loginData);
  }

  //get view
  obj.getView = ()=>{
    return $http.get(_urlBase+'view');
  }

  //checkout
  obj.checkout = (id, person, qty)=>{
    var req = {
      method: 'POST',
      url: `${_urlBase}a/checkout/${id}/${person}/${qty}`,
      headers: {
        'x-access-token': _token
      },
      data: items
    }

    //log out
    obj.logOut = ()=>{
      _name = 'Guest';
      _admin = false;
      _token = null;
    };

    return $http(req);
  }



  return obj;//return the object
}]);

//Login Controller
app.controller('LoginCheckController', ['$scope', '$location', 'thingsAPI',
  function ($scope, $location,  thingsAPI) {
    // Can be used for Admin login
    $scope.user = {};
    $scope.showAdminLogin = false;

    $scope.LoginCheck = function() {
      var loginData = $scope.user;
      thingsAPI.authenticate(loginData).then(
        function(response){
            if(response.status == 200){
              console.log(response);
              console.log(response.headers);
              thingsAPI.setUserName(response.headers('username'));
              thingsAPI.setAdmin(response.headers('admin'));
              thingsAPI.setToken(response.headers('token'));
              $location.path('home');
            }
       },
       function(err, response){
         console.log(`AUTHENTICATE ERROR: ${err}, RESPONSE: ${response}`)
       }
      );
    };
  $scope.SetAdminLogin = function() {
    $scope.showAdminLogin = !$scope.showAdminLogin;
  }
}]);

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





//=============Shopping List Controller=================
app.controller('ShoppingListController', ['$scope', '$http', ShoppingListController]);
function ShoppingListController($scope, $http) {
  //Get latest inventory data from database
  $http.get("https://things.cs.pdx.edu:3000/view")
  .success(function (data) {
      $scope.shoppingList = data;
  });

}


//=============Inventory Controller===============
app.controller('InventoryController', ['$scope', '$http', '$uibModal', '$location', '$rootScope',  'cartList', InventoryController]);
function InventoryController($scope, $http, $uibModal, $location, $rootScope, cartList) {
  $rootScope.baseURL = 'https://things.cs.pdx.edu:3000/';
  //Get latest inventory data from database
  $http.get($rootScope.baseURL +'view')
  .then(function (response) {
      $scope.inventory = response.data;
  });

  //Add to cart
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
app.controller('CartController', ['$scope', '$http',  '$location', '$rootScope', 'cartList', 'DTOptionsBuilder', 'DTColumnDefBuilder', CartController]);
function CartController($scope, $http,  $location, $rootScope, cartList, DTOptionsBuilder, DTColumnDefBuilder){

  //Initialization purposes
  $scope.cart = [];
  $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('sDom', 'rtip');
  $scope.emptyNameError = true;

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

  //Check name
  $scope.checkName = function(){
    if(angular.isUndefined($scope.userName)){
      $scope.emptyNameError = true;
      return true;
    }
    else{
      if($scope.userName.length == 0){
        $scope.emptyNameError = true;
        return true;
      }
      else{
        $scope.emptyNameError = false;
        return false;
      }
    }
  }

  //Check Quantity
  $scope.checkQuantity = function(){
    if(angular.isUndefined($scope.userName)){
      $scope.emptyNameError = true;
      return true;
    }
    else{
      if($scope.userName.length == 0){
        $scope.emptyNameError = true;
        return true;
      }
      else{
        $scope.emptyNameError = false;
      }
    }
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
              //$scope.apply();
      }
      //Else 404 error....Could need another modal
    });
  }
}

//Request Controller
app.controller('RequestController', ['$scope', '$http', '$location', RequestController]);
function RequestController($scope, $http, $location){
  $scope.question = {};

  //sendRequest
  $scope.sendRequest = function() {
    var qData = $scope.question;
    $http.post('https://localhost:3000/request', qData).then(function(response){
      console.log(response.status);
      if(response.status === 200){
              $location.path("home");
      }
      //Else 404 error....
    });
  }
}

//Inventory Controller
app.controller('InventoryController', ['$scope', '$http',  '$location', 'cartList', InventoryController]);
function InventoryController($scope, $http,  $location, cartList) {
  //Get latest inventory data from database
  $http.get("https://things.cs.pdx.edu:3000/view").then(function (response) {
      $scope.inventory = response.data;
      console.log($scope.inventory);
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
    $httpBackend.whenGET('templates/html/shoppinglist.html').passThrough();

    $httpBackend.whenGET('templates/html/promptQuantity.html').passThrough();
    $httpBackend.whenGET("http://localhost:3000/view").passThrough();
    $httpBackend.whenJSONP(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenGET(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenPOST(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenPOST(/https:\/\/localhost:3000\/*/).passThrough();

});
