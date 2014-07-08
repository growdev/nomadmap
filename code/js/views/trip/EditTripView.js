define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/trip/EditTripView',
  'views/feedback/FeedbackView',
  'text!templates/trip/editTripTemplate.html',
  'jquery/jQuery.dbFormat',
  'jquery/jQuery.ui'
], function($, _, Backbone, Parse, EditTripView, FeedbackView, viewTemplate, dbFormat, datePicker){

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
      
      var compiledTemplate = _.template( viewTemplate, {trip: this.trip} );
      this.$el.html(compiledTemplate);

      $('input[name=startDate]').datepicker({
        numberOfMonths: 3,
        showButtonPanel: true
      });

      $('input[name=endDate]').datepicker({
        numberOfMonths: 3,
        showButtonPanel: true
      });

      if (this.trip.get("startDate") && this.trip.get("startDate") instanceof Date) {
        
        $('input[name=startDate]').datepicker("setDate", this.trip.get("startDate"));
      } 
      
      var endDateFormatted = "";
      if (this.trip.get("endDate") && this.trip.get("endDate") instanceof Date) {
        $('input[name=endDate]').datepicker("setDate", this.trip.get("endDate"));
      } 
    },

    save: function() {
      
      self = this; // pass this copy into callback blocks
      
      self.trip.set('destination', $("input[name=destination]").val());  

      var startDate = $('input[name=startDate]').datepicker("getDate");
      var endDate = $('input[name=endDate]').datepicker("getDate");

      // FIXME : should be 2 methods (isDateInFuture & isDateBefore. This should also be on the backend)
      var now = new Date();
      if (startDate < now) {
        FeedbackView.prototype.errorMessage('Start date must be in the future');
        return false;
      }

      if (startDate > endDate) {
        FeedbackView.prototype.errorMessage('Start date must be equals or before the end date');
        return false; 
      }

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
