(function() {
  angular.module("typeahead", []).directive("typeahead", [
    "$timeout", "$rootScope", function($timeout, $rootScope) {
      return {
        template: function(element, attributes) {
          var emptyMessage;
          emptyMessage = attributes.emptyMessage != null ? attributes.emptyMessage : "No results found for \"{{" + (attributes["ngModel"] || "term") + "}}\"";
          return "<div ng-keydown=\"typeaheadKeydown($event)\" ng-keyup=\"typeaheadKeyup($event)\">\n	<input ng-model=\"term\" type=\"text\" autocomplete=\"off\" />\n	<div class=\"empty\" ng-show=\"isEmpty && hasFilter\">" + emptyMessage + "</div>\n	<div ng-click=\"typeaheadSelect($event)\" ng-show=\"!isEmpty\" ng-transclude></div>\n</div>";
        },
        scope: true,
        transclude: true,
        restrict: "E",
        compile: function(element, attributes) {
          var $el, attr, isEmpty, needHide, value, _ref;
          needHide = false;
          isEmpty = false;
          scope.hasFilter = false;
          $el = element.find("input");
          _ref = attributes.$attr;
          for (attr in _ref) {
            value = _ref[attr];
            $el.attr(value, attributes[attr]);
            element[0].removeAttribute(value);
          }
          return function(scope, element, attributes) {
            var $input, $lis, $ul, currentEl, hideList, select, setAsCurrent, setCurrent, setFirstAsCurrent, setLastAsCurrent;
            $ul = $lis = currentEl = null;
            $input = element.find("input");
            $input[0].addEventListener("blur", function() {
              needHide = true;
              return $timeout(function() {
                if (needHide) {
                  return hideList();
                }
              }, 150);
            });
            $timeout(function() {
              $ul = element.find("ul");
              $lis = element.find("li");
              $lis.addClass(attributes.showIfEmpty != null ? "show" : "hide");
              scope.isEmpty = !$lis.length;
              return null;
            });
            hideList = function() {
              if (attributes.showIfEmpty == null) {
                return $lis.removeClass("show").removeClass("active").addClass("hide");
              }
            };
            setCurrent = function(direction) {
              var oldCurrentEl;
              if (!($ul && $ul[0].getElementsByClassName("show")[0])) {
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
              var text;
              if (el.tagName === "LI") {
                text = angular.element(el).text();
                $rootScope.$broadcast("typeahead:input", text);
                $timeout(function() {
                  $input.val(text).triggerHandler("input");
                  return hideList();
                });
              }
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
                  if (currentEl != null) {
                    select(currentEl);
                  } else {
                    $rootScope.$broadcast("typeahead:input", $input.val());
                  }
                  break;
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
              needHide = false;
              return select(evt.target);
            };
            return scope.typeaheadKeyup = function(evt) {
              var liEl, term, _i, _len, _ref1;
              if ((_ref1 = evt.which) === 38 || _ref1 === 40 || _ref1 === 16 || _ref1 === 32 || _ref1 === 13 || _ref1 === 27) {
                return;
              }
              term = $input.val().toLowerCase();
              scope.hasFilter = !!term;
              scope.isEmpty = true;
              for (_i = 0, _len = $lis.length; _i < _len; _i++) {
                liEl = $lis[_i];
                if ((!term && (attributes.showIfEmpty != null)) || (term && liEl.innerHTML.toLowerCase().indexOf(term) >= 0)) {
                  liEl.className = "show";
                  scope.isEmpty = false;
                } else {
                  liEl.className = "hide";
                }
              }
              return null;
            };
          };
        }
      };
    }
  ]);

}).call(this);
