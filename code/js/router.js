// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/profile/EditProfileView',
  'views/security/LoginView',
  'views/security/SignupView',
  'views/security/ResetView',
  'views/footer/FooterView',
  'views/feedback/FeedbackView',
  'views/staticPage/StaticPageView',
  'views/trip/EditTripView',
  'views/trip/ListTripsForCurrentUserView',
  'views/map/MapView',
  'models/trip/TripModel'
], function($, _, Backbone, Parse, EditProfileView, LoginView, SignupView, ResetView, FooterView, FeedbackView, StaticPageView, EditTripView, ListTripsForCurrentUserView, MapView, TripModel) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      ''                    : 'map',
      'map'                 : 'map',
      
      'signup'              : 'signup',
      'logoff'              : 'logoff',
      'login'               : 'login',
      'reset'               : 'reset',
      'resetDone'           : 'resetDone', 

      'profile'             : 'editProfile',
      
      'page/:page'          : 'page',
      
      'trips/:action'       : 'trips',
      'trips/edit/:tripId'  : 'editTrip',
      
      // Default
      '*actions'            : 'defaultAction'
    },

    currentView: null,
    el: $("#page"), // where content gets loaded

    checkLogin: function () {
      if (!Parse.User.current()) {
        var loginView = new LoginView();
        loginView.render();
        this.switchView(loginView);
        FeedbackView.prototype.errorMessage("You must sign in to view this page");
        return false;
      } 

      return true;
    }, 

    switchView: function(view) {
      if (this.currentView) {
        // Detach the old view
        this.currentView.remove();
      }

      // Move the view element into the DOM (replacing the old content)
      this.el.html(view.el);

      // Render view after it is in the DOM (styles are applied)
      view.render();

      this.currentView = view;
    },
  });
  
  var initialize = function (){

    Parse.initialize('GQOQo8VY22XFTOYEv7f2L9lqR03FhSG6jOaJ1pYL', 'ZtaNTnLyhjaOOzYTFf964XTtlpCWplkgIlijgrUs');
    var app_router = new AppRouter;

    Backbone.View.prototype.goTo = function (loc) { //http://stackoverflow.com/a/9528230/1343140
      app_router.navigate(loc, true);
    };

    Backbone.View = Backbone.View.extend({
      remove: function() {
        // Empty the element and remove it from the DOM while preserving events
        $(this.el).empty().detach();

        return this;
      }
    });

    if (Parse.User.current()) { // if user refreshes page make sure login stays in place
        $('.logoff').remove(); 
        $('.nav').append("<li class='logoff'><a href='#/logoff'>Logoff</a></li>");
    }

    app_router.on('route:signup', function (actions) {
        var signupView = new SignupView();
        app_router.switchView(signupView);
    });

    app_router.on('route:reset', function (actions) {
        FeedbackView.prototype.dismiss();
        var resetView = new ResetView();
        app_router.switchView(resetView);
    });

    app_router.on('route:resetDone', function (actions) {
        FeedbackView.prototype.successMessage("Password reset");
        var loginView = new LoginView();
        app_router.switchView(loginView);
    });

    app_router.on('route:page', function (page) {
        var staticPageView = new StaticPageView();
        staticPageView.templateName = page;
        app_router.switchView(staticPageView);
    });

    app_router.on('route:map', function (action){
      if (!app_router.checkLogin()) {
        return;
      }

      var mapView = new MapView();
      app_router.switchView(mapView);
    });

    app_router.on('route:trips', function (action){
    
        if (!app_router.checkLogin()) {
          return;
        } 

        if (action == "add") {
          // probably this logic should be in the View
          var trip = new TripModel();
          var acl = new Parse.ACL();
          acl.setPublicWriteAccess(false);
          acl.setPublicReadAccess(true);
          acl.setWriteAccess(Parse.User.current(), true);

          trip.setACL(acl);

          var editTripView = new EditTripView(trip);
          app_router.switchView(editTripView);

          return;
        }

        if (action == "list") {
          var listTrips = new ListTripsForCurrentUserView();

          app_router.switchView(listTrips);
         return;
        }
        
        var staticPageView = new StaticPageView();
        staticPageView.templateName = 'notFound';
        app_router.switchView(staticPageView);
    });

    app_router.on('route:editTrip', function (tripId){
    
        if (!app_router.checkLogin()) {
          return;
        } 

        var tripModel = new TripModel();
        var query = new Parse.Query(TripModel);

        FeedbackView.prototype.activityMessage("Loading Trip");
        query.get(tripId, {
          success: function(trip) {
            var editTripView = new EditTripView(trip);
            app_router.switchView(editTripView);
            FeedbackView.prototype.dismiss();
          },
          error: function(trip, error) {
            FeedbackView.prototype.errorMessage("Error loading trip: " + error.message);
          }
        });
    });

    app_router.on('route:editProfile', function(){
    
      if (!app_router.checkLogin()) {
        return;
      } 

      var editProfileView = new EditProfileView();
      app_router.switchView(editProfileView);
    });

    app_router.on('route:logoff', function(actions) {
      Parse.User.logOut();
      app_router.navigate('login', true);
      $('.logoff').remove();
      FeedbackView.prototype.successMessage("You are logged out");
    });

    app_router.on('route:login', function(actions) {
        var loginView = new LoginView();
        loginView.render();
        app_router.switchView(loginView);
    });

    app_router.on('route:defaultAction', function (actions) {
      var staticPageView = new StaticPageView();
      staticPageView.templateName = 'notFound';
      app_router.switchView(staticPageView);
    });

    var footerView = new FooterView();

    Backbone.history.start();
  };

  return { 
    initialize: initialize
  };
});
