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