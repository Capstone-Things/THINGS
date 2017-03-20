/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains AngularJS code for navigation bar and navigating through the
multiple tabs.
*/
(function () {
    "use strict";

    angular.module("navbarapp", [])
      .directive("bootstrapNavbar", bootstrapNavbar);

    function bootstrapNavbar() {
        return {
            restrict: "E",         // (2)
            replace: true,         // (3)
            transclude: true,
            templateUrl: "templates/html/bootstrapNavbar.html",
        };
    }
})();
