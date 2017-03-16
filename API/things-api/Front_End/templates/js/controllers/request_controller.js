var app = angular.module("catthings_app");


//Request Controller
app.controller('RequestController', ['$scope', '$http', '$location', '$window', 'thingsAPI', RequestController]);
function RequestController($scope, $http, $location, $window, thingsAPI){
  $scope.question = {};

  //sendRequest
  $scope.sendRequest = function() {
    var qData = $scope.question;
    thingsAPI.request(qData).then(function(response){
      if(response.status === 200){
        $window.alert("Request submitted succesfully");
      }
      else{
        $window.alert("Unable to submit request. Please try again or contact an administrator");
      }
    });
  };
}
