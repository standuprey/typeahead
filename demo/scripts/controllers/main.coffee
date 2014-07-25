"use strict"
angular.module("demo").controller "MainCtrl", ($scope) ->
	$scope.autocompleteValues = ["Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Caparo", "Caterham", "Chevrolet", "Chrysler", "Citroen", "Corvette", "Dacia", "Daihatsu", "Dodge ", "Ferrari", "Fiat", "Fisker", "Ford", "Gordon Murray", "Honda", "Hummer", "Hyundai", "Infiniti", "Jaguar ", "Jeep", "Kia", "Koenigsegg", "KTM", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lotus ", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan", "Nissan", "Noble", "Pagani", "Peugeot", "Porsche", "Proton", "Renault", "Rolls-Royce", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tata", "Tesla Motors", "Toyota", "Vauxhall", "VW ", "Volvo"]
	$scope.obj =
		name: ""
	$scope.$on "typeahead:input", (e, input) ->
		$scope.input = input