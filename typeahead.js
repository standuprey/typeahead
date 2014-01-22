(function() {
  angular.module("typeahead", []).directive("typeahead", [
    "$timeout", function($timeout) {
      return {
        template: "<div ng-keydown=\"keydown($event)\"><input ng-hide=\"inputFromParent\" ng-model=\"term\" type=\"text\" autocomplete=\"off\" /><div ng-transclude></div></div>",
        transclude: true,
        replace: true,
        restrict: "E",
        scope: {
          inputFromParent: "@?model"
        },
        link: function(scope, element, attributes) {
          var $lis, $ul, currentEl, setAsCurrent, setCurrent, setFirstAsCurrent, setLastAsCurrent, watchTerm;
          $lis = $ul = currentEl = null;
          $timeout(function() {
            $lis = element.find("li");
            $ul = element.find("ul");
            $lis.addClass("hide");
            return null;
          });
          watchTerm = scope.inputFromParent ? "$parent." + scope.inputFromParent : "term";
          scope.$watch(watchTerm, function() {
            var liEl, term, _i, _len;
            if (!$lis) {
              return;
            }
            if (currentEl) {
              currentEl.className = "show";
            }
            currentEl = null;
            term = scope.inputFromParent ? scope.$parent[scope.inputFromParent] : scope.term;
            for (_i = 0, _len = $lis.length; _i < _len; _i++) {
              liEl = $lis[_i];
              liEl.className = term && liEl.innerHTML.toLowerCase().indexOf(term) >= 0 ? "show" : "hide";
            }
            return null;
          });
          setCurrent = function(direction) {
            var oldCurrentEl;
            if (currentEl) {
              currentEl.className = "show";
              oldCurrentEl = currentEl;
              currentEl = currentEl["" + direction + "Sibling"];
              if (currentEl) {
                while (currentEl && (!currentEl.className || currentEl.className.indexOf("hide") >= 0)) {
                  currentEl = currentEl["" + direction + "Sibling"];
                }
                if (!currentEl) {
                  currentEl = oldCurrentEl;
                }
                currentEl.className += " active";
              } else {
                setAsCurrent(direction);
              }
            } else {
              setAsCurrent(direction);
            }
            return null;
          };
          setAsCurrent = function(direction) {
            if (direction === "next") {
              setFirstAsCurrent();
            } else {
              setLastAsCurrent();
            }
            return null;
          };
          setFirstAsCurrent = function() {
            currentEl = $ul[0].getElementsByClassName("show")[0];
            if (currentEl) {
              currentEl.className += " active";
            }
            return null;
          };
          setLastAsCurrent = function() {
            var els;
            els = $ul[0].getElementsByClassName("show");
            currentEl = els[els.length - 1];
            if (currentEl) {
              currentEl.className += " active";
            }
            return null;
          };
          return scope.keydown = function(evt) {
            switch (evt.which) {
              case 38:
                return setCurrent("previous");
              case 40:
              case 16:
                return setCurrent("next");
              case 13:
              case 32:
                if (currentEl != null) {
                  if (scope.inputFromParent) {
                    return scope.$parent[scope.inputFromParent] = currentEl.innerHTML;
                  } else {
                    return scope.term = currentEl.innerHTML;
                  }
                }
            }
          };
        }
      };
    }
  ]);

}).call(this);
