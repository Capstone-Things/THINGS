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



//Original Controller
app.controller("catthings_ctrl", function ($scope, $window) {

});

app.controller('InventoryController', ['$scope', '$http', InventoryController]);
function InventoryController($scope, $http) {

  //Get latest inventory data from database
  $http.get('/view').then(function (response) {
      $scope.inventory = response.data;
  });

  $scope.cart=[];

  //Add to cart
  $scope.addToCart = function(item) {
    item.checked = false;
    $scope.cart.push(item);
  };

  //Remove selected items from cart
  $scope.removeSelected = function() {
    var newCart=[];
        angular.forEach($scope.cart,function(item){
        if(!item.checked){
            newCart.push(item);
        }
    });
    $scope.cart=newCart;
  }
}

/* Old inventory controller
//Mock API Call Test
app.controller('Inventory', function Inventory($http) {
    var ctrl = this;

    ctrl.inventory = [];
    ctrl.getInventory = function () {
        $http.get('/view').then(function (response) {
            ctrl.inventory = response.data;
        });
    };

    ctrl.getInventory();
});
*/

app.run(function ($httpBackend) {
    var inventory = [{name: 'Pop Tarts', description: 'Yummy', quantity: '5'}, {name: 'Kool-Aid', description: 'Oh Yeah', quantity: '10'}, {name: 'Printer Ink', description: 'Ink for printer', quantity: '30'}];

    //returns the current inventory list
    $httpBackend.whenGET('/view').respond(inventory);

    //checkout items
    //$httpBackend.whenPost('/checkout').respond();

    $httpBackend.whenGET('templates/html/login.html').passThrough();
    //$httpBackend.whenGET('/templates/html/login.html').passThrough();
    $httpBackend.whenGET('templates/html/home.html').passThrough();
    //$httpBackend.whenGET('../html/home.html').passThrough();
});
