define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/trip/EditTripView',
  'views/feedback/FeedbackView',
  'text!templates/trip/editTripTemplate.html',
  'jquery/jQuery.dbFormat'
], function($, _, Backbone, Parse, EditTripView, FeedbackView, viewTemplate, dbFormat){

  var EditTripView = Backbone.View.extend({
    // el: $("#page"),
    trip : null,

    events: {
      "submit form.edit-trip-form": "save",
      "focusout form.edit-trip-form input[name=destination]" : "getCoordinates",
      "click form.edit-trip-form .cancel" : "cancel",
    },

    initialize: function(trip) {
      this.trip = trip;
    },

    render: function(){
     
      $('.menu li').removeClass('active');
      $('.menu li a[href="#/trips/list"]').parent().addClass('active');
      
      var startDateFormatted = "";
      if (this.trip.get("startDate") && this.trip.get("startDate") instanceof Date) {
        startDateFormatted = this.trip.get("startDate").dbFormat();
      } 
      
      var endDateFormatted = "";
      if (this.trip.get("endDate") && this.trip.get("endDate") instanceof Date) {
        endDateFormatted = this.trip.get("endDate").dbFormat();
      } 

      var compiledTemplate = _.template( viewTemplate, {trip: this.trip, tripStart: startDateFormatted, tripEnd: endDateFormatted} );
      this.$el.html(compiledTemplate);
    },

    save: function() {
      
      self = this; // pass this copy into callback blocks
      
      self.trip.set('destination', $("input[name=destination]").val());  

      var startDate = new Date( $("input[name=startDate]").val() );
      var endDate = new Date( $("input[name=endDate]").val() );

      self.trip.set('startDate', startDate);
      self.trip.set('endDate', endDate);
      self.trip.set('notes', $("textarea[name=notes]").val());
      self.trip.set('point', self.point);
      FeedbackView.prototype.activityMessage("Saving trip data");

      self.trip.save(null, {
        success: function(trip) {
          FeedbackView.prototype.successMessage("Trip saved");
          EditTripView.prototype.goTo('#/trips/list');
        },

        error: function(trip, error) {
          FeedbackView.prototype.errorMessage("Error saving: " + error.message);
          console.log(error.message);
        }
      });        

      return false;
    },

    cancel: function() {
      EditTripView.prototype.goTo('#/trips/list');
    },

    getCoordinates: function() {
      var address = $("input[name=destination]").val();
      var self = this;
      require(['async!http://maps.google.com/maps/api/js?sensor=false!callback'], function(){
 
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            self.point = new Parse.GeoPoint({latitude: results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng()});
          } else {
            FeedbackView.prototype.errorMessage('Geocode was not successful for the following reason: ' + status);
          }
        }); 
      });
    }
  });

  return EditTripView;
});
