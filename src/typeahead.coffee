angular.module("typeahead", []).directive "typeahead", ["$timeout", "$compile", ($timeout, $compile) ->

	template: """
	<div ng-keydown="typeaheadKeydown($event)" ng-keyup="typeaheadKeyup($event)"><input ng-model="term" type="text" autocomplete="off" /><div ng-click="typeaheadSelect($event)"><div ng-transclude></div></div></div>
	"""
	scope: true
	transclude: true
	restrict: "E"
	compile: (element, attributes) ->
		# copy the directive's attributes into the template's input element
		templateAttrs = []
		# $el used to be called $input but:
		# http://walpurgisriot.github.io/blog/2013/12/16/the-worst-thing-about-coffeescript
		$el = element.find "input"
		for attr, value of attributes.$attr
			$el.attr value, attributes[attr]
			element[0].removeAttribute value

		(scope, element, attributes) ->
			$lis = $ul = currentEl = null
			$input = element.find "input"

			$timeout ->
				$ul = element.find "ul"
				$ul.addClass "hide"
				null

			setCurrent = (direction) ->
				return unless $ul[0].getElementsByClassName("show")[0]
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
			select = (el) ->
				$timeout ->
					$input.val(el.innerHTML).triggerHandler("input")
					$lis.removeClass("show").removeClass("active").addClass "hide"
				null
			scope.typeaheadKeydown = (evt) ->
				switch evt.which
					when 38 # top
						setCurrent "previous"
					when 40, 16 # down, shift
						setCurrent "next"
					when 13, 32 # enter, space
						select(currentEl) if currentEl?
					when 27 # esc
						$lis.removeClass("show").removeClass("active").addClass "hide"
						currentEl = null
					else
						currentEl.className = "show" if currentEl
						currentEl = null
				null
			scope.typeaheadSelect = (evt) -> select evt.target
			scope.typeaheadKeyup =(evt) ->
				return if evt.which in [38, 40, 16, 32, 13, 27]
				unless $lis
					$lis = $ul.find "li"
					$lis.addClass "hide"
					$ul.removeClass "hide"
				# we don't use ng-model (scope.term) here, because it might have been overwritten
				# if the declaration is something like <typeahead ng-model="something">...
				term = $input.val().toLowerCase()
				for liEl in $lis
					liEl.className = if term and liEl.innerHTML.toLowerCase().indexOf(term) >= 0 then "show" else "hide"
				null
]