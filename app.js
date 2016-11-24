var app = angular.module("checkout_app", []); 
app.controller("checkout_ctrl", function($scope) {
    $scope.items = {
      poptarts: {
          item_name: "Pop Tarts",
          quantity: 50,
          description: "Delicous breakfast pastry",
          tags:["snacks", "pantry"]
      },
      printer_ink: {
          item_name: "Printer Ink",
          quantity: 100,
          description: "Black printer ink for HP-1050",
          tags:["ink", "printer supply"]
      }
      
    };
});