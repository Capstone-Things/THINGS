var app = angular.module("catthings_app");
//=============NavBar Controller=================
app.controller('NavBarController', ['$scope', NavBarController]);
function NavBarController($scope) {
    $scope.isCollapsed = true;
}
