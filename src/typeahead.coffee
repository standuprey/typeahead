angular.module("typeahead", []).directive "typeahead", ["$timeout", ($timeout) ->

	template: """
	<div ng-keydown="keydown($event)"><input ng-model="term" type="text" autocomplete="off" /><div ng-transclude></div></div>
	"""
	transclude: true
	replace: true
	restrict: "E"
	scope: {}
	link: (scope, element, attributes) ->
		$lis = $ul = currentEl = null
		$timeout ->
			$lis = element.find "li"
			$ul = element.find "ul"
			$lis.addClass "show"
		scope.$watch "term", ->
			return unless $lis
			currentEl.className = "show" if currentEl
			currentEl = null
			for liEl in $lis
				term = (scope.term || "").toLowerCase()
				liEl.className = if liEl.innerHTML.toLowerCase().indexOf(term) >= 0 then "show" else "hide"
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
		scope.keydown = (evt) ->
			switch evt.which
				when 38 # top
					setCurrent "previous"
				when 40, 16 # down, shift
					setCurrent "next"
				when 13, 32 # enter, space
					scope.term = currentEl.innerHTML if currentEl?
]