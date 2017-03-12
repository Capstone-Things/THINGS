var app = angular.module("catthings_app");


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
