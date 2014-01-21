angular.module("typeahead", []).directive "typeahead", [ ->

	template: """
	<div></div>
	"""
	transclude: true
	replace: true
	restrict: "E"
	scope: {}
	link: (scope, element, attributes) ->
]