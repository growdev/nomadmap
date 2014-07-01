// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'router', // Request router.js
], function($, _, Backbone, Parse, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  };

  return {
    initialize: initialize
  };
});
