// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/home/HomeView',
  'views/profile/ProfileView',
  'views/security/LoginView',
  'views/security/SignupView',
  'views/footer/FooterView'
], function($, _, Backbone, Parse, HomeView, ProfileView, LoginView, SignupView, FooterView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'profile': 'showProfile',
      
      'signup' : 'signup',

      // Default
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){

    Parse.initialize('GQOQo8VY22XFTOYEv7f2L9lqR03FhSG6jOaJ1pYL', 'ZtaNTnLyhjaOOzYTFf964XTtlpCWplkgIlijgrUs');
    var app_router = new AppRouter;
    
    Backbone.View.prototype.goTo = function (loc) { //http://stackoverflow.com/a/9528230/1343140
      app_router.navigate(loc, true);
    };

    app_router.on('route:signup', function (actions) {
        var signupView = new SignupView();
        signupView.render();
    });

    app_router.on('route:showProfile', function(){
    
        if (!Parse.User.current()) {
          var loginView = new LoginView();
          loginView.render();
          return;
        } 

        var profileView = new ProfileView();
        profileView.render();

    });

    app_router.on('route:defaultAction', function (actions) {
        
        if (!Parse.User.current()) {
          var loginView = new LoginView();
          loginView.render();
          return;
        } 

       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        homeView.render();
    });

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
    var footerView = new FooterView();

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});
