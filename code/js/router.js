// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/home/HomeView',
  'views/profile/ProfileView',
  'views/profile/EditProfileView',
  'views/security/LoginView',
  'views/security/SignupView',
  'views/footer/FooterView',
  'views/feedback/FeedbackView',
  'views/staticPage/StaticPageView',
  'views/trip/EditTripView',
  'views/trip/ListTripsForCurrentUserView',
  'views/map/MapView',
  'models/trip/TripModel'
], function($, _, Backbone, Parse, HomeView, ProfileView, EditProfileView, LoginView, SignupView, FooterView, FeedbackView, StaticPageView, EditTripView, ListTripsForCurrentUserView, MapView, TripModel) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'profile': 'editProfile',
      
      'signup' : 'signup',

      'page/:page' : 'page',

      'logoff' : 'logoff',

      'trips/:action' : 'trips',
      'trips/edit/:tripId' : 'editTrip',

      'map' : 'map',

      // Default
      '*actions': 'defaultAction'
    }, 

    checkLogin: function () {
      if (!Parse.User.current()) {
        var loginView = new LoginView();
        loginView.render();
        this.changeView(loginView);
        FeedbackView.prototype.errorMessage("You must sign in to view this page");
        return false;
      } 

      return true;
    }, 

    changeView: function (view) {
      this.viewLS && this.viewLS.destroy_view();
      this.viewLS = view;
    }
  });
  
  var initialize = function (){

    Parse.initialize('GQOQo8VY22XFTOYEv7f2L9lqR03FhSG6jOaJ1pYL', 'ZtaNTnLyhjaOOzYTFf964XTtlpCWplkgIlijgrUs');
    var app_router = new AppRouter;
    
    Backbone.View.prototype.goTo = function (loc) { //http://stackoverflow.com/a/9528230/1343140
      app_router.navigate(loc, true);
    };

    Backbone.View.prototype.destroy_view = function() { //http://stackoverflow.com/a/11534056/1343140

        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();

        this.$el.removeData().unbind(); 

        // Remove view from DOM
        this.remove();  
        Backbone.View.prototype.remove.call(this);
    }

    if (Parse.User.current()) { // if user refreshes page make sure login stays in place
        $('.logoff').remove(); 
        $('.nav').append("<li class='logoff'><a href='#/logoff'>Logoff</a></li>");
    }

    app_router.on('route:signup', function (actions) {
        var signupView = new SignupView();
        app_router.changeView(signupView);
        signupView.render();
    });

    app_router.on('route:page', function (page) {
        var staticPageView = new StaticPageView();
        app_router.changeView(staticPageView);
        staticPageView.renderPage(page);
    });

    app_router.on('route:map', function (action){
      if (!app_router.checkLogin()) {
        return;
      }

      var mapView = new MapView();
      app_router.changeView(mapView);
      mapView.render();
    });

    app_router.on('route:trips', function (action){
    
        if (!app_router.checkLogin()) {
          return;
        } 

        if (action == "add") {
          var trip = new TripModel();

          var acl = new Parse.ACL();
          acl.setPublicWriteAccess(false);
          acl.setPublicReadAccess(true);
          acl.setWriteAccess(Parse.User.current(), true);

          trip.setACL(acl);

          var editTripView = new EditTripView(trip);
          app_router.changeView(editTripView);
          editTripView.render();

          return;
        }

        if (action == "list") {
          var listTrips = new ListTripsForCurrentUserView();

          // app_router.changeView(listTrips);
          listTrips.render();
          return;
        }
        
        var staticPageView = new StaticPageView();
        app_router.changeView(staticPageView);
        staticPageView.renderPage("not found");
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
            app_router.changeView(editTripView);
            editTripView.render();
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
      app_router.changeView(editProfileView);
      editProfileView.render();
    });

    app_router.on('route:logoff', function(actions) {
      Parse.User.logOut();
      app_router.navigate('login', true);
      $('.logoff').remove();
      FeedbackView.prototype.successMessage("You are logged out");
    });

    app_router.on('route:defaultAction', function (actions) {
        
        if (!app_router.checkLogin()) {
          return;
        } 

       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        app_router.changeView(homeView);
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
