typeahead Angular Module
========================

Very barebone angular typeahead module. Creates an autocomplete for input fields

Install
-------

Copy the typeahead.js and typeahead.css file into your project and add the following line with the correct path:

		<script src="/path/to/scripts/typeahead.js"></script>
		<script src="/path/to/scripts/typeahead.css"></script>

Alternatively, if you're using bower, you can add this to your component.json (or bower.json):

		"angular-typeahead-basic": "~0.0.1"

And add this to your HTML:

		<script src="components/angular-typeahead-basic/typeahead.js"></script>
		<script src="components/angular-typeahead-basic/typeahead.css"></script>

Note that the style is very minimal, it's up to you to make it fit your need.

Usage
-----
		<typeahead>
			<ul>
					<li ng-repeat="value in autocompleteValues">{{value}}</li>
			</ul>
		</typeahead>

And don't forget to add the module to your application

		angular.module("myApp", ["typeahead"])

Every attribute that you add to the typeahead tag will be put to the input tag.
Note that the default type for input is text, but it can be changed, for example `<typeahead type="email">`

Options
-------

- `show-if-empty`
	You can decide to keep the list visible when no input is entered by adding the `show-if-empty` attribute like this:

			<typeahead type="email" show-if-empty>

- `empty-message`
	You can customize the message to display if there is no results.
	Defaults to "No results found"
	Leave empty or set to "" to remove the message
	You can insert the search result like this:

			<typeahead placeholder="Enter the name of a car manufacturer" ng-model="obj.name" empty-message="Never heard of a {{obj.name}} car">

Event
-------

The Event "typeahead:input" will be sent when the input is selected, so you can register to the event this way (the demo includes that too):

		$scope.$on("typeahead:input", function(e, input) {...});

Demo
----

Try the (very simple) demo. How to run the demo? Simple...

		git clone git@github.com:standup75/typeahead.git
		cd typeahead
		npm install && bower install
		grunt server

This should open your browser at http://localhost:9000 where the demo now sits.
