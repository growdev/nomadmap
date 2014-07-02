'use strict';

require.config({
  paths: {
    backbone: 'libs/backbone/backbone-min',
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    parse: 'libs/parse/parse.min',
    templates: '../templates',
    async: 'libs/require/async',
  },
  shim: {
      // underscore: {
      //     exports: '_'
      // },
      // backbone: {
      //     deps: [
      //         'underscore',
      //         'jquery'
      //     ],
      //     exports: 'Backbone'
      // },
      // bootstrap: {
      //     deps: ['jquery'],
      //     exports: 'jquery'
      // },
      parse: {
          deps: ['jquery', 'underscore'],
          exports: 'Parse'
      }, 
      'jquery.toTitleCase': {
        deps: ['jquery'],
        wrapShim: true
      },
      'jquery.dbFormat': {
        deps: ['jquery'],
        wrapShim: true
      }
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
