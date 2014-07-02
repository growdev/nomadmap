define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'models/trip/TripModel',
  'collections/trips/TripsCollection',
  'text!templates/trip/listTripsTemplate.html',
  'views/feedback/FeedbackView',
  'views/trip/ListTripsForCurrentUserView'
], function ($, _, Backbone, Parse, TripModel, TripsCollection, viewTemplate, FeedbackView, ListTripsForCurrentUserView){

  var ListTripsForCurrentUserView = Backbone.View.extend({
    el: $("#page"),

    events: {
      "click .trips-list a": "edit"
    },

    render: function (){
      
      // $('.menu li').removeClass('active');
      // $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      
      var myTrips = new TripsCollection(); //Parse.Query(new TripModel()).greaterThanOrEqualTo("endDate", new Date()).equalTo("nomad", Parse.User.currentUser());
      myTrips.query = new Parse.Query(TripModel);

      FeedbackView.prototype.activityMessage("Loading trips...");

      self = this;

      myTrips.query.find({
        success: function(results) {
          var compiledTemplate = _.template( viewTemplate, {trips: results} );
          self.$el.html(compiledTemplate);
          FeedbackView.prototype.dismiss();
        },

        error: function(error) {
          FeedbackView.prototype.errorMessage("Problem loading trips: " + error.message);
        }
      });
    }, 

    edit: function (e){
      var id = $(e.currentTarget).data("id");
      ListTripsForCurrentUserView.prototype.goTo("#/trips/edit/"+id);
    }
  });

  return ListTripsForCurrentUserView;
});
