({
    baseUrl: "./js",
    name: "main",
    out: "./js/main-built.js",
    mainConfigFile: 'js/main.js',
    paths: {
	    backbone: 'libs/backbone/backbone-min',
	    jquery: 'libs/jquery/jquery-min',
	    underscore: 'libs/underscore/underscore-min',
	    parse: 'libs/parse/parse.min',
	    templates: '../templates'
	  }
})