# Nomad Map
Nomad Map allows registered users to see the whereabouts of other digital nomads on a map. It's built with a thick client architecture with all the logic existing on the client side. The following libraries are used:

- [Parse](http://www.parse.com) Parse is the backend for the application and it manages security
- Parse is built on top of [Backbone](http://www.backbonejs.org) which gives an MVC structure to the project
- [Underscore](http://underscorejs.org) is used for templating
- [jQuery](http://jquery.com) is used for DOM manipulation. The [datepicker](http://jqueryui.com/datepicker/) is a jQuery UI plugin
- [RequireJS](http://requirejs.org) is used for keeping things modular and for build optimising
- [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/) for maps and geo coding
- [Bootstrap](http://getbootstrap.com) Included this by default, could easily be swapped for something else as nothing is really styled at the moment

## Project Structure
The project is based on the example at [Backbone Tutorials](http://backbonetutorials.com/organizing-backbone-using-modules/):

- code/
	- css/
	- imgs/
	- js/
		- collections/  not using collections much, probably could be using them better
		- libs/  external libraries
		- models/  the trip model lives in here
		- views/  these are more like controllers. most of the javascript you write lives in these folders
	- templates/  All the HTML lives here. Underscore.js is used to render variables
	- app.js  boiler plate code
	- main.js  the bootstrap. add references to external libraries here
	- router.js  this takes the url and parses it and decides which view to load

	- playgrounds/  a safe place to mess around with things in Parse

- documents-and-design  there's a data model diagram and a diagram overview of the structure. source docs are omnigraffle

- todo.txt  list of quick fixes and tech things that need doing. working through the quick fixes is in here is a fast way to get introduced to the project. 

### Minify/'build'
	cd <path to repo>/code
	node r.js -o build.js

This requires node.js to be installed on your local machine, but the r.js file is included in the distribution

### To change between minified and dev version
There's two script tags in the index html, uncomment one and comment out the other to switch between minified and dev versions.

### Files to Deploy
	- index.html
	- css/*
	- js/libs/require/*
	- js/main-built.js

### Files Not to Deploy
All the rest :) They are really useful for debugging on the local version, but not required in production once the minify has been run.