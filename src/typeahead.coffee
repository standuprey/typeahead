angular.module("typeahead", []).directive "typeahead", ["$timeout", "$rootScope", ($timeout, $rootScope) ->

	template: (element, attributes) ->
		emptyMessage = if attributes.emptyMessage? then attributes.emptyMessage else "No results found for \"{{#{attributes["ngModel"] || "term"}}}\""
		"""
		<div ng-keydown="typeaheadKeydown($event)" ng-keyup="typeaheadKeyup($event)">
			<input ng-model="term" type="text" autocomplete="off" />
			<div class="empty" ng-show="isEmpty">#{emptyMessage}</div>
			<div ng-click="typeaheadSelect($event)" ng-show="!isEmpty" ng-transclude></div>
		</div>
		"""
	scope: true
	transclude: true
	restrict: "E"
	compile: (element, attributes) ->
		needHide = false
		# $el used to be called $input but:
		# http://walpurgisriot.github.io/blog/2013/12/16/the-worst-thing-about-coffeescript
		$el = element.find "input"
		for attr, value of attributes.$attr
			$el.attr value, attributes[attr]
			element[0].removeAttribute value

		(scope, element, attributes) ->
			scope.isEmpty = false
			$ul = $lis = currentEl = null
			$input = element.find "input"

			# we don't use ng-blur to make sure typeahead can have a custom ng-blur too
			$input[0].addEventListener "blur", ->
				needHide = true
				$timeout ->
					hideList() if needHide
				, 150

			$timeout ->
				$ul = element.find "ul"
				$lis = element.find "li"
				$lis.addClass(if attributes.showIfEmpty? then "show" else "hide")
				null

			hideList = -> $lis.removeClass("show").removeClass("active").addClass("hide") unless attributes.showIfEmpty?

			setCurrent = (direction) ->
				return unless $ul and $ul[0].getElementsByClassName("show")[0]
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
				if el.tagName is "LI"
					text = angular.element(el).text()
					$rootScope.$broadcast "typeahead:input", text
					$timeout ->
						$input.val(text).triggerHandler("input")
						hideList()
				null
			scope.typeaheadKeydown = (evt) ->
				switch evt.which
					when 38 # top
						setCurrent "previous"
					when 40, 16 # down, shift
						setCurrent "next"
					when 13 # enter
						if currentEl?
							select(currentEl)
						else
							$rootScope.$broadcast "typeahead:input", $input.val()
					when 32 # space
						select(currentEl) if currentEl?

					when 27 # esc
						hideList()
						currentEl = null
					else
						currentEl.className = "show" if currentEl
						currentEl = null
				null
			scope.typeaheadSelect = (evt) ->
				needHide = false
				select evt.target
			scope.typeaheadKeyup =(evt) ->
				return if evt.which in [38, 40, 16, 32, 13, 27]
				# we don't use ng-model (scope.term) here, because it might have been overwritten
				# if the declaration is something like <typeahead ng-model="something">...
				term = $input.val().toLowerCase()
				# Reselect LIs every time in case some have been added dynamically
				scope.isEmpty = true
				for liEl in $lis
					if (not term and attributes.showIfEmpty?) or (term and liEl.innerHTML.toLowerCase().indexOf(term) >= 0)
						liEl.className = "show"
						scope.isEmpty = false
					else
						liEl.className = "hide"
				null
]