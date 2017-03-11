//acts as a middleman between the request page and the API. Packages information from the user and sends it to the API
//which will respond accordingly by emailing an admin with details of the request
//written by Austen Ruzicka

var app = angular.module("catthings_app");


//Request Controller
app.controller('RequestController', ['$scope', '$http', '$location', 'thingsAPI', RequestController]);
function RequestController($scope, $http, $location, thingsAPI){
  $scope.question = {};

  //sendRequest
  $scope.sendRequest = function() {
    var qData = $scope.question;
    thingsAPI.request(qData).then(function(response){
      console.log(response.status);
      if(response.status === 200){
              $location.path("home");
      }
      //Else 404 error....
    });
  }
}
