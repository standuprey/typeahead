angular.module("typeahead", []).directive "typeahead", ["$timeout", "$compile", ($timeout, $compile) ->

	res =
		template: """
		<div ng-keydown="typeaheadKeydown($event)" ng-keyup="typeaheadKeyup()"><input ng-change="typeaheadChange()" ng-model="term" type="text" autocomplete="off" /><div ng-transclude></div></div>
		"""
		scope: true
		transclude: true
		restrict: "E"
		compile: (element, attributes) ->
			# copy the directive's attributes into the template's input element
			templateAttrs = []
			$input = element.find "input"
			$input.attr(value, attributes[attr]) for attr, value of attributes.$attr

			(scope, element, attributes) ->
				$lis = $ul = currentEl = null
				$input = element.find "input"

				$timeout ->
					$ul = element.find "ul"
					$ul.addClass "hide"
					null

				setCurrent = (direction) ->
					if currentEl
						currentEl.className = "show"
						oldCurrentEl = currentEl
						currentEl = currentEl["#{direction}Sibling"]
						if currentEl
							currentEl = currentEl["#{direction}Sibling"] while currentEl and (!currentEl.className or currentEl.className.indexOf("hide") >= 0)
							currentEl = oldCurrentEl unless currentEl
							currentEl.className += " active"
						else
							setAsCurrent direction
					else
						setAsCurrent direction
					null
				setAsCurrent = (direction) ->
					if direction is "next"
						setFirstAsCurrent()
					else
						setLastAsCurrent()
					null
				setFirstAsCurrent = ->
					currentEl = $ul[0].getElementsByClassName("show")[0]
					currentEl.className += " active" if currentEl
					null
				setLastAsCurrent = ->
					els = $ul[0].getElementsByClassName("show")
					currentEl = els[els.length - 1]
					currentEl.className += " active" if currentEl
					null
				scope.typeaheadKeydown = (evt) ->
					switch evt.which
						when 38 # top
							setCurrent "previous"
						when 40, 16 # down, shift
							setCurrent "next"
						when 13, 32 # enter, space
							$input.val(currentEl.innerHTML).triggerHandler("input") if currentEl?
						else
							currentEl.className = "show" if currentEl
							currentEl = null
					null
				scope.typeaheadKeyup = ->
					unless $lis
						$lis = $ul.find "li"
						$lis.addClass "hide"
						$ul.removeClass "hide"
					# we don't use ng-model (scope.term) here, because it might have been overwritten
					# if the declaration is something like <typeahead ng-model="something">...
					term = $input.val().toLowerCase()
					for liEl in $lis
						cssClass = if liEl.className.indexOf("active") is -1 then "" else "active "
						cssClass += if term and liEl.innerHTML.toLowerCase().indexOf(term) >= 0 then "show" else "hide"
						liEl.className = cssClass
					null
	res
]