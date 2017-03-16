//the view history controller. This controller acts as a middleman between the view history html page and the API
//this controller packages up data for the view history page to use to display its entries
//written by Austen Ruzicka

var app = angular.module('catthings_app');

//Inventory Controller
app.controller('HistoryController', ['$scope', '$http',  '$location', 'thingsAPI', HistoryController]);
function HistoryController($scope, $http,  $location, thingsAPI) {
  //empty history lists
  $scope.recentHistory = [];
  $scope.itemHistory = [];
  $scope.tagHistory = [];
  $scope.dateHistory = [];

  //gets the last 15 transactions to display if no number is specified, otherwise get that number of transactions
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

  //gets the last 15 transactions to display for a specific item if no number is specified, otherwise get that number of transactions
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

  //gets the last 15 transactions to display for a specific item by tag if no number is specified, otherwise get that number of transactions
  $scope.getTagHistory = function(){
      if($scope.number >= 1){
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

  //gets a range of transactions between a start and end date
  $scope.getDateHistory = function(){
      thingsAPI.getDateHistory($scope.startDate, $scope.endDate).then(function(response){
        console.log(response.status);
        console.log(response.data);
        if(response.status === 200){
              $scope.dateHistory = response.data;
        }
      });
  }
}
