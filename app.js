var app = angular.module("checkout_app", []); 
app.controller("checkout_ctrl", function ($scope, $log) {
    
    $scope.items = [
        {
            id: 0,
            item_name: "Pop Tarts",
            quantity: 12,
            description: "Delicous breakfast pastry",
            tags: ["snacks", "pantry"]
        },
        {
            id: 1,
            item_name: "Printer Ink",
            quantity: 4,
            description: "Black printer ink for HP-1050",
            tags: ["ink", "printer supply"]
        }
    ];
    
    $scope.cart = [];
    
    $scope.addToCart = function (id) {
        var index = -1, itemArr = $scope.items, i = 0;
		for (i = 0; i < $scope.items.length; i = i + 1) {
			if (itemArr[i].id === id) {
				index = i;
                $scope.cart.push({
                    id: $scope.items[i].id,
                    item_name: $scope.items[i].item_name,
                    quantity: 1
                });
				$scope.items[i].quantity -= 1;
                break;
			}
		}
		if (index === -1) {
			$scope.$log("Something gone wrong");
        }
    };
    
    $scope.removeFromCart = function () {
        
    };
    
    $scope.checkout = function () {
        $scope.log("Checkout complete");
    };
});