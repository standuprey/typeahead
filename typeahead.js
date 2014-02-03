(function() {
  angular.module("typeahead", []).directive("typeahead", [
    "$timeout", function($timeout) {
      return {
        template: "<div ng-keydown=\"typeaheadKeydown($event)\" ng-keyup=\"typeaheadKeyup($event)\">\n	<input ng-model=\"term\" type=\"text\" autocomplete=\"off\" />\n	<div ng-click=\"typeaheadSelect($event)\" ng-transclude></div>\n</div>",
        scope: true,
        transclude: true,
        restrict: "E",
        compile: function(element, attributes) {
          var $el, attr, value, _ref;
          $el = element.find("input");
          _ref = attributes.$attr;
          for (attr in _ref) {
            value = _ref[attr];
            $el.attr(value, attributes[attr]);
            element[0].removeAttribute(value);
          }
          return function(scope, element, attributes) {
            var $input, $ul, currentEl, hideList, select, setAsCurrent, setCurrent, setFirstAsCurrent, setLastAsCurrent;
            $ul = currentEl = null;
            $input = element.find("input");
            $input[0].addEventListener("blur", function() {
              return hideList();
            });
            $timeout(function() {
              $ul = element.find("ul");
              $ul.find("li").addClass(attributes.showIfEmpty != null ? "show" : "hide");
              return null;
            });
            hideList = function() {
              if (attributes.showIfEmpty == null) {
                return $ul.find("li").removeClass("show").removeClass("active").addClass("hide");
              }
            };
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
              $timeout(function() {
                $input.val(el.innerHTML).triggerHandler("input");
                return hideList();
              });
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
                  hideList();
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
              var liEl, term, _i, _len, _ref1, _ref2;
              if ((_ref1 = evt.which) === 38 || _ref1 === 40 || _ref1 === 16 || _ref1 === 32 || _ref1 === 13 || _ref1 === 27) {
                return;
              }
              term = $input.val().toLowerCase();
              _ref2 = $ul.find("li");
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                liEl = _ref2[_i];
                liEl.className = (!term && (attributes.showIfEmpty != null)) || (term && liEl.innerHTML.toLowerCase().indexOf(term) >= 0) ? "show" : "hide";
              }
              return null;
            };
          };
        }
      };
    }
  ]);

}).call(this);
