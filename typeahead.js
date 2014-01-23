(function() {
  angular.module("typeahead", []).directive("typeahead", [
    "$timeout", "$compile", function($timeout, $compile) {
      var res;
      res = {
        template: "<div ng-keydown=\"typeaheadKeydown($event)\" ng-keyup=\"typeaheadKeyup($event)\"><input ng-model=\"term\" type=\"text\" autocomplete=\"off\" /><div ng-click=\"typeaheadSelect($event)\"><div ng-transclude></div></div></div>",
        scope: true,
        transclude: true,
        restrict: "E",
        compile: function(element, attributes) {
          var $input, attr, templateAttrs, value, _ref;
          templateAttrs = [];
          $input = element.find("input");
          _ref = attributes.$attr;
          for (attr in _ref) {
            value = _ref[attr];
            $input.attr(value, attributes[attr]);
            element[0].removeAttribute(value);
          }
          return function(scope, element, attributes) {
            var $lis, $ul, currentEl, select, setAsCurrent, setCurrent, setFirstAsCurrent, setLastAsCurrent;
            $lis = $ul = currentEl = null;
            $input = element.find("input");
            $timeout(function() {
              $ul = element.find("ul");
              $ul.addClass("hide");
              return null;
            });
            setCurrent = function(direction) {
              var oldCurrentEl;
              if (!$ul[0].getElementsByClassName("show")[0]) {
                return;
              }
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
            select = function(el) {
              $input.val(el.innerHTML).triggerHandler("input");
              $lis.removeClass("show").removeClass("active").addClass("hide");
              return null;
            };
            scope.typeaheadKeydown = function(evt) {
              switch (evt.which) {
                case 38:
                  setCurrent("previous");
                  break;
                case 40:
                case 16:
                  setCurrent("next");
                  break;
                case 13:
                case 32:
                  if (currentEl != null) {
                    select(currentEl);
                  }
                  break;
                case 27:
                  $lis.removeClass("show").removeClass("active").addClass("hide");
                  currentEl = null;
                  break;
                default:
                  if (currentEl) {
                    currentEl.className = "show";
                  }
                  currentEl = null;
              }
              return null;
            };
            scope.typeaheadSelect = function(evt) {
              return select(evt.target);
            };
            return scope.typeaheadKeyup = function(evt) {
              var liEl, term, _i, _len, _ref1;
              if ((_ref1 = evt.which) === 38 || _ref1 === 40 || _ref1 === 16 || _ref1 === 32 || _ref1 === 13 || _ref1 === 27) {
                return;
              }
              if (!$lis) {
                $lis = $ul.find("li");
                $lis.addClass("hide");
                $ul.removeClass("hide");
              }
              term = $input.val().toLowerCase();
              for (_i = 0, _len = $lis.length; _i < _len; _i++) {
                liEl = $lis[_i];
                liEl.className = term && liEl.innerHTML.toLowerCase().indexOf(term) >= 0 ? "show" : "hide";
              }
              return null;
            };
          };
        }
      };
      return res;
    }
  ]);

}).call(this);
