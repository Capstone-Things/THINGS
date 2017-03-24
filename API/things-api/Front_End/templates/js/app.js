/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains global AngularJS code.
*/

/*global angular*/
//var app = angular.module("catthings_app");
var app = angular.module("catthings_app",
  ['datatables', 'ui.bootstrap' , 'datatables.buttons', 'ngMockE2E', 'ui.router', 'navbarapp', 'chart.js']);
//UI Router Config
app.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

    // For any unmatched url, send to /index
    $urlRouterProvider.otherwise("/");
    //List the pages to open when given a state
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
        .state('additem',{
          url: "/additem",
          templateUrl: 'templates/html/additem.html'
        })
        .state('viewhistory',{
          url: "/viewhistory",
          templateUrl: 'templates/html/viewhistory.html'
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


app.run(function () {});
