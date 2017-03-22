/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for viewing transaction history by taking
user input and making an API call to get the data and display it.
*/
var app = angular.module('catthings_app');

//Inventory Controller
app.controller('HistoryController', ['$scope', '$http',  '$location', 'thingsAPI', HistoryController]);
function HistoryController($scope, $http,  $location, thingsAPI) {
  //Empty history lists
  $scope.recentHistory = [];
  $scope.itemHistory = [];
  $scope.tagHistory = [];
  $scope.dateHistory = [];

  //input objects
  $scope.tag=undefined;
  $scope.number=15;
  $scope.item=undefined;

  //Date objects
  $scope.startDate = new Date();
  $scope.endDate = new Date();



  /*
  Gets the last 15 transactions to display if no number is specified.
  Otherwise, get that number of transactions
  */
  $scope.getRecentHistory = function(){
      if($scope.numRecent >= 1){
        thingsAPI.getRecent($scope.numRecent).then(function(response){
          console.log(response.status);
          console.log(response.data);
          if(response.status === 200){
                $scope.recentHistory = response.data;
          }
        });
      }
      else{
        thingsAPI.getRecent(15).then(function(response){
          console.log(response.data);
          if(response.status === 200){
            $scope.recentHistory = response.data;
          }
        });
      }
  }

  /*
  Gets the last 15 transactions to display for a specific item if no number is
  specified. Otherwise, get that number of transactions
  */
  $scope.getItemHistory = function(){
      if($scope.num >= 1){
        thingsAPI.getItemHistory($scope.num, $scope.item).then(function(response){
          console.log(response.status);
          console.log(response.data);
          if(response.status === 200){
                $scope.itemHistory = response.data;
          }
        });
      }
      else{
        thingsAPI.getItemHistory(15, $scope.item).then(function(response){
          console.log(response.data);
          if(response.status === 200){
            $scope.itemHistory = response.data;
          }
        });
      }
  }

  /*
  Gets the last 15 transactions to display for a specific item by tag if no
  number is specified. Otherwise, get that number of transactions.
  */
  $scope.getTagHistory = function(){
      if ($scope.number >= 1) {
        thingsAPI.getTagHistory($scope.number, $scope.tag).then(function(response){
          console.log(response.status);
          console.log(response.data);
          if(response.status === 200){
                $scope.tagHistory = response.data;
          }
        });
      }
      else{
        thingsAPI.getTagHistory(15, $scope.tag).then(function(response){
          console.log(response.data);
          if(response.status === 200){
            $scope.tagHistory = response.data;
          }
        });
      }
  }

  //Gets a range of transactions between a start and end date.
  $scope.getDateHistory = function(){
      thingsAPI.getDateHistory($scope.startDate.toISOString(), $scope.endDate.toISOString()).then(function(response){
        console.log(response.status);
        console.log(response.data);
        if(response.status === 200){
              $scope.dateHistory = response.data;
        }
      });
  }




      //make tab a property of TabCtrl & set an initial value
      //hint: comparable to ng-init
  $scope.tab = 1;

      //create a function expression, creating the assignment logic
  $scope.selectTab = function (setTab) {
          //make tab equal to setTab
      $scope.tab = setTab;
      };

      //create a function for our comparison
  $scope.isTab = function (checkTab) {
      return $scope.tab === checkTab;
      };
}
