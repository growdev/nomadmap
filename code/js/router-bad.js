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
      // this doesn't work :(
      // this.viewLS && this.viewLS.destroy_view();
      // this.viewLS = view;
    },

    initialize: function (){

      Parse.initialize('GQOQo8VY22XFTOYEv7f2L9lqR03FhSG6jOaJ1pYL', 'ZtaNTnLyhjaOOzYTFf964XTtlpCWplkgIlijgrUs');
      
      Backbone.View.prototype.goTo = function (loc) { //http://stackoverflow.com/a/9528230/1343140
        self.navigate(loc, true);
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
    },

    signup: function (actions) {
        var signupView = new SignupView();
        signupView.render();
    },

    page: function (page) {
        var staticPageView = new StaticPageView();
        staticPageView.renderPage(page);
    },

    map: function (action){
      if (!this.checkLogin()) {
        return;
      }

      var mapView = new MapView();
      mapView.render();
    },

    trips: function (action){
      if (!self.checkLogin()) {
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
        editTripView.render();

        return;
      }

      if (action == "list") {
        var listTrips = new ListTripsForCurrentUserView();

        // self.changeView(listTrips);
        listTrips.render();
        return;
      }
      
      var staticPageView = new StaticPageView();
      staticPageView.renderPage("not found");
    },

    editTrip: function (tripId){
    
        if (!self.checkLogin()) {
          return;
        } 

        var tripModel = new TripModel();
        var query = new Parse.Query(TripModel);

        FeedbackView.prototype.activityMessage("Loading Trip");
        query.get(tripId, {
          success: function(trip) {
            var editTripView = new EditTripView(trip);
            editTripView.render();
            FeedbackView.prototype.dismiss();
          },
          error: function(trip, error) {
            FeedbackView.prototype.errorMessage("Error loading trip: " + error.message);
          }
        });
    },

    editProfile: function(){
    
      if (!self.checkLogin()) {
        return;
      } 

      var editProfileView = new EditProfileView();
      editProfileView.render();
    },

    logoff: function(actions) {
      Parse.User.logOut();
      self.navigate('login', true);
      $('.logoff').remove();
      FeedbackView.prototype.successMessage("You are logged out");
    },

    defaultAction: function (actions) {
        
        if (!self.checkLogin()) {
          return;
        } 

       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        homeView.render();
    }
  });
  return AppRouter;  
});
