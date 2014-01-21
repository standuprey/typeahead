(function() {
  angular.module("typeahead", []).directive("typeahead", [
    function() {
      return {
        template: "typeahead_here",
        restrict: "E",
        scope: {},
        link: function(scope, element, attributes) {}
      };
    }
  ]);

}).call(this);
