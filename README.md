typeahead Angular Module
========================

Very barebone angular typeahead module. Creates an autocomplete for input fields

Install
-------

Copy the typeahead.js and typeahead.css file into your project and add the following line with the correct path:

		<script src="/path/to/scripts/typeahead.js"></script>
		<script src="/path/to/scripts/typeahead.css"></script>

Alternatively, if you're using bower, you can add this to your component.json (or bower.json):

		"typeahead": "git://github.com/standup75/typeahead.git"

And add this to your HTML:

		<script src="components/typeahead/typeahead.js"></script>
		<script src="components/typeahead/typeahead.css"></script>

Note that the style is very minimal, it's up to you to make it fit your need.

Usage
-----
		<typeahead>
			<ul ng-repeat="value in autocompleteValues">
					<li>{{value}}</li>
			</ul>
		</typeahead>

And don't forget to add the module to your application

		angular.module("myApp", ["typeahead"])

Every attribute that you add to the typeahead tag will be put to the input tag.
Note that the default type for input is text, but it can be changed, for example <typeahead type="email">

Options
-------

You can decide to keep the list visible by adding the show-if-empty attribute like this:
		<typeahead type="email" show-if-empty>

Demo
----

Try the (very simple) demo. How to run the demo? Simple...

		git clone git@github.com:standup75/typeahead.git
		cd typeahead
		npm install && bower install
		grunt server

This should open your browser at http://localhost:9000 where the demo now sits.
