//the view history controller. This controller acts as a middleman between the view history html page and the API
//this controller packages up data for the view history page to use to display its entries
//written by Austen Ruzicka

var app = angular.module('catthings_app');

//Inventory Controller
app.controller('HistoryController', ['$scope', '$http',  '$location', 'thingsAPI', HistoryController]);
function HistoryController($scope, $http,  $location, thingsAPI) {
  //empty history lists
  $scope.recentHistory = [];

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
}
