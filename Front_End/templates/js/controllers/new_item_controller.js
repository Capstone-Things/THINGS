//controller for adding new items into the database. Acts as an intermediary between the add item page and the API
//information from the user is sent here from the webpage which is passed along to the API which will insert the new item
//into the database
//written by Austen Ruzicka

var app = angular.module("catthings_app");


//Request Controller
app.controller('NewItemController', ['$scope', '$http', '$location', 'thingsAPI', NewItemController]);
function NewItemController($scope, $http, $location, thingsAPI){
  //sendRequest
  $scope.addNewItem = function() {
    //$http.post('/add')
    thingsAPI.add($scope.itemName, $scope.description, $scope.price, $scope.threshold)
    .then(function(response){
      console.log(response);
      console.log(response.status);
      console.log(response.data);
      if(response.status === 200){
            $location.path("home");
        }
      });
      //Else 404 error...
    }
  }
