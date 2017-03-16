var app = angular.module("catthings_app");


app.controller('StatisticController', ['$scope', '$http', '$location', 'cartList', 'thingsAPI', 'inventoryList', StatisticController]);
function StatisticController($scope, $http, $location, cartList, thingsAPI, inventoryList) {

    $scope.inventory = [];

    $scope.labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    $scope.graphData = [];

    $scope.showGraph = false;

    //Get latest inventory data from database
    thingsAPI.getView().then(function (response) {
        //console.log(response.data);
        for (var i = 0; i < response.data.length; ++i) {
            $scope.inventory[i] = { name: response.data[i].name, item_id: response.data[i].item_id };
        }
        console.log($scope.inventory);
    });

    $scope.goBack = function () {
        $scope.showGraph = false;
    };

    $scope.getStatistic = function (name) {
        $scope.itemName = name;
        $scope.showGraph = true;

        for (var i = 0; i < $scope.inventory.length; ++i) {
            if ($scope.inventory[i].name == name) {
                $scope.item_Id = $scope.inventory[i].item_id;
            }
        }

        thingsAPI.getStatistic($scope.item_Id).then(function (response) {
            //parse out the data and fill it in with the graph
            console.log(response.data);
            for (var i = 0; i < response.data.length; ++i) {
                $scope.graphData[i] = response.data[i].checkout_per_day;
            }


        }, function(err){
            console.log(err);
        });

    };

}
