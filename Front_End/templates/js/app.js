/*global angular*/
var app = angular.module("catthings_app", ['ui.bootstrap', 'ngMockE2E', 'ui.router']);

//UI Router Config
app.config(function($stateProvider, $urlRouterProvider) {

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
          templateUrl: 'templates/html/home.html',
        })
        .state('cart', {
          url: "/cart",
          templateUrl: 'templates/html/cart.html'
        });
});

//Login Controller
app.controller('LoginCheckController', ['$scope', '$location', LoginCheckController]);
function LoginCheckController($scope, $location) {
    /* Can be used for Admin login
    $scope.users = [{
        UserName: 'admin',
        Password: 'password'
    }];
    */
    $scope.LoginCheck = function() {
        $location.path("home");
    };
}

//Original Controller...May not be needed
app.controller("catthings_ctrl", function ($scope, $window) {

});

//Service to manage cart
app.service('cartList', [cartList]);
function cartList () {
  var cart = [];
  return {
      getCart: function () {
          return cart;
      },
      addToCart: function(item) {
          cart.push(item);
          console.log(cart);
      },
      removeSelected: function(){
        var newCart=[];
            angular.forEach(cart,function(item){
            if(!item.checked){
                newCart.push(item);
            }
        });
        cart=newCart;
        return cart;
      }
  };
}

//NavBar Controller
app.controller('NavBarController', ['$scope', NavBarController]);
function NavBarController($scope) {
    $scope.isCollapsed = true;
}

//Cart Controller
app.controller('CartController', ['$scope', '$http', '$uibModal', 'cartList', CartController]);
function CartController($scope, $http, $uibModal, cartList){
  $scope.cart = cartList.getCart();

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

  //Remove selected items from cart
  $scope.removeSelected = function() {
    $scope.cart = cartList.removeSelected();
    check();
  }

  //Checkout
  $scope.Checkout = function() {
    console.log($scope.cart);

    $http.post('/checkout', $scope.cart).then(function(){

    });
  }
}

//Inventory Controller
app.controller('InventoryController', ['$scope', '$http', '$uibModal', '$location', 'cartList', InventoryController]);
function InventoryController($scope, $http, $uibModal, $location, cartList) {
  //Get latest inventory data from database
  $http.get('/view').then(function (response) {
      $scope.inventory = response.data;
  });

  $scope.addToCart = function(item){
    var cartItem = angular.copy(item); //Make copy of the item to add to cart
    cartItem.check = false;
    $scope.currentQuantity = item.quantity; //Get current quantity of item
    var answer = $uibModal.open({templateUrl: 'templates/html/promptQuantity.html',
                                 backdrop: 'static',
                                 controller: PromptQuantityController,
                                 scope: $scope
                               });
    answer.result.then(function(response){
      console.log(response);
      if(response != "Canceled"){
        cartItem.quantity = response;
        cartList.addToCart(cartItem);
      }
    });
  }
}

//Controller for promptQuantity.html
var PromptQuantityController = function PromptQuantityController($scope, $uibModalInstance){
  $scope.ok = function(){
    console.log($scope.currentQuantity);
    console.log($scope.quantity)
    if(parseInt($scope.quantity) <= parseInt($scope.currentQuantity)){
        if(parseInt($scope.quantity) > 0){
            $uibModalInstance.close($scope.quantity);
        }
    }
  };
  $scope.close = function(result){
    $uibModalInstance.close(result);
  };
}

app.run(function ($httpBackend) {
    var inventory = [{name: 'Pop Tarts', description: 'Yummy', quantity: '5'}, {name: 'Kool-Aid', description: 'Oh Yeah', quantity: '10'}, {name: 'Printer Ink', description: 'Ink for printer', quantity: '30'}];

    //returns the current inventory list
    $httpBackend.whenGET('/view').respond(inventory);

    //checkout items
    $httpBackend.whenPOST('/checkout').respond(function(method, url, data) {
        console.log(method);
        console.log(url);
        console.log(data);
    });

    $httpBackend.whenGET('templates/html/login.html').passThrough();
    $httpBackend.whenGET('templates/html/home.html').passThrough();
    $httpBackend.whenGET('templates/html/cart.html').passThrough();
    $httpBackend.whenGET('templates/html/promptQuantity.html').passThrough();
});
