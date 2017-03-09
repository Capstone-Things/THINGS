var app = angular.module("catthings_app");
//=============NavBar Controller=================
app.controller('NavBarController', ['$scope', '$location', 'thingsAPI', NavBarController]);
function NavBarController($scope, $location, thingsAPI) {
    $scope.isCollapsed = true;
   	$scope.credential = {};
   	$scope.credential.isAdmin = false;
   	if(thingsAPI.getAdmin() == 'true')
   	{
   		$scope.credential.isAdmin = true;
   	}
    $scope.credential.userName = thingsAPI.getUserName();


    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}