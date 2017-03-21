/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code for obtaining the statistics from the
API and displaying it to the user.
*/

﻿var app = angular.module("catthings_app");

app.controller('StatisticController', ['$scope', '$http', '$location', 'cartList', 'thingsAPI', 'inventoryList', StatisticController]);
function StatisticController($scope, $http, $location, cartList, thingsAPI, inventoryList) {
  //Variables
  $scope.inventory = [];
  $scope.labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $scope.graphData = [];
  $scope.showGraph = false;

  //Get latest inventory data from database
  thingsAPI.getView().then(function (response) {
      for (var i = 0; i < response.data.length; ++i) {
          $scope.inventory[i] = { name: response.data[i].name, item_id: response.data[i].item_id };
      }
      console.log($scope.inventory);
  });

  //Get latest average checkout per day from past week
  thingsAPI.getAverage().then(function (response){
    for (var i = 0; i < response.data.length; i++){
      for (var j = 0; j < $scope.inventory.length; j++){
        if(response.data[i].item_id == $scope.inventory[j].item_id){
          $scope.inventory[j].round = response.data[i].round;
        }
      }
    }
  });

  //Get average consumption from past week
  thingsAPI.getAverageWeekly().then(function (response){
    for (var i = 0; i < response.data.length; i++){
      for (var j = 0; j < $scope.inventory.length; j++){
        if(response.data[i].item_id == $scope.inventory[j].item_id){
          $scope.inventory[j].weekly = response.data[i].weekly_avg;
        }
      }
    }
  });

  //Closes the graph
  $scope.goBack = function () {
      $scope.showGraph = false;
  };

  //Get the statistic from the API
  $scope.getStatistic = function (name) {
      $scope.itemName = name;
      $scope.showGraph = true;

      for (var i = 0; i < $scope.inventory.length; ++i) {
          if ($scope.inventory[i].name == name) {
              $scope.item_Id = $scope.inventory[i].item_id;
          }
      }

      thingsAPI.getStatistic($scope.item_Id).then(function (response) {
          //Parse out the data and fill it in with the graph
          for (var i = 0; i < response.data.length; ++i) {
              $scope.graphData[i] = response.data[i].checkout_per_day;
          }
      }, function(err){
          console.log(err);
      });

  };

}
