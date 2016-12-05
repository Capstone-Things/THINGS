var app = angular.module("checkout_app", ['ui.bootstrap']); 
app.controller("checkout_ctrl", function ($scope, $log) {
    
    $scope.search_field = "";
    $scope.user_name = "";
    
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
        },
        {
            id:2,
            item_name: "#2 Pencil",
            quantity: 100,
            description: "#2 graphite pencils",
            tags:["Office Supply", "Consumable"]
        }
    ];
    
    //this array represents the cart
    $scope.cart = [];
    
    $scope.addToCart = function (id) {
        var index = -1, itemArr = $scope.items, i = 0, j=0, alreadyInCart = false, cartIndex = -1;
		for (i = 0; i < $scope.items.length; i = i + 1) {
			if (itemArr[i].id === id) {
                //we have identified the proper item
				index = i;
                //lets see if there are already some in the cart, if so
                for (j=0; j< $scope.cart.length; j = j +1) {
                    if ($scope.cart[j].id === id) {
                        //lets just add 1 moreto the existing cart qty
                        alreadyInCart = true;
                        cartIndex = j;
                    }
                }
                if (alreadyInCart) {
                    $scope.cart[cartIndex].quantity += 1;
                }
                else {
                    //create a new cart item
                    $scope.cart.push({
                    id: $scope.items[i].id,
                    item_name: $scope.items[i].item_name,
                    quantity: 1
                    });
                }
				break;
			}
		}
		if (index === -1) {
			$scope.$log("Something gone wrong");
        }
    };
    
    $scope.removeFromCart = function (id) {
        for (var i=0; i < $scope.cart.length; i=i+1){
            if($scope.cart[i].id === id){
                $scope.cart.splice(i,1);
                break;
            }
        }
    };
    
    $scope.checkout = function () {
        var checkout_item = $scope.cart.pop();
        while(checkout_item != null){
            $scope.items[checkout_item.id].quantity -= checkout_item.quantity;
            checkout_item = $scope.cart.pop();
        }
        <!-- TODO: trigger confirmation message -->
    };
}); 