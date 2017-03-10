/*global angular*/
//var app = angular.module("catthings_app");
var app = angular.module("catthings_app",
  ['datatables', 'ui.bootstrap', 'ngMockE2E', 'ui.router', 'navbarapp', 'chart.js']);
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

          templateUrl: 'templates/html/checkIn.html'
        })
        .state('statistic',{
          url: "/statistic",
          templateUrl: 'templates/html/statistic.html'
        });
   $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     'https://things.cs.pdx.edu:3000/**'
   ]);
});

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

    $httpBackend.whenGET('templates/html/bootstrapNavbar.html').passThrough();
    $httpBackend.whenGET('templates/html/statistic.html').passThrough();

    $httpBackend.whenGET('templates/html/checkIn.html').passThrough();
    $httpBackend.whenGET('templates/html/promptQuantity.html').passThrough();
    $httpBackend.whenGET("http://localhost:3000/view").passThrough();
    $httpBackend.whenJSONP(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenGET(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenPOST(/https:\/\/things\.cs\.pdx\.edu:3000\/*/).passThrough();
    $httpBackend.whenPOST(/https:\/\/localhost:3000\/*/).passThrough();

});
