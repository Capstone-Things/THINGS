/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/
/*
This file contains the AngularJS code for the navigation bar controller.
*/
var app = angular.module("catthings_app");

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
