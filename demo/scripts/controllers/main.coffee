"use strict"
angular.module("demo").controller "MainCtrl", ($scope) ->
	$scope.autocompleteValues = []
	$scope.obj =
		name: ""
	$scope.$on "typeahead:input", (e, input) ->
		$scope.input = input