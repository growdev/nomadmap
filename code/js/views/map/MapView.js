define([
          'jquery',
          'underscore',
          'backbone',
          'parse',
          'text!templates/map/mapTemplate.html',
          'collections/trips/TripsCollection',
          'models/trip/TripModel',
          'views/feedback/FeedbackView',
          'jquery/jQuery.dbFormat'
        ], function ($, _, Backbone, Parse, viewTemplate, TripsCollection, TripModel, FeedbackView, dbFormat){

  var MapView = Backbone.View.extend({
    // el: $("#page"),
   
    events: {
      "change input[name=pick-date] ": "updateMap"
    },

    render: function(){
      
      var self = this;

      $('.menu li').removeClass('active');
      $('.menu li a[href="#/map"]').parent().addClass('active');

      this.$el.html(viewTemplate);

      $('input[name=pick-date]').val(new Date().dbFormat());

      this.updateMap();
      
    }, 

    updateMap: function () {

      var dateField = $('input[name=pick-date]').val();

      if (!dateField || dateField == '') {
        FeedbackView.prototype.errorMessage("Please enter a valid date");
        return;
      }
      
      var dateObject = new Date(dateField);

      var myTrips = new TripsCollection(); //Parse.Query(new TripModel()).greaterThanOrEqualTo("endDate", new Date()).equalTo("nomad", Parse.User.currentUser());
      myTrips.query = new Parse.Query(TripModel);
      myTrips.query.lessThanOrEqualTo('startDate', dateObject);
      myTrips.query.greaterThanOrEqualTo('endDate', dateObject);

      FeedbackView.prototype.activityMessage("Loading trips...");

      self = this;

      myTrips.query.find({
        success: function(trips) {
          require(['async!http://maps.google.com/maps/api/js?sensor=false!callback'], function (){
 
            var mapDiv = document.getElementById('map-canvas');
            
            var map = new google.maps.Map(mapDiv, {
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              navigationControl: true,
            });

            var latlngbounds = new google.maps.LatLngBounds();
            
            if (!trips.length) {
              FeedbackView.prototype.successMessage("There's no trips for that date!");
              return;
            }

            _.each(trips, function(trip){
              var point = trip.get('point');
              if (!point) {
                return; // is continue
              }

              var myLatlng = new google.maps.LatLng(point.latitude, point.longitude);
        
              latlngbounds.extend(myLatlng);
              var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Hello World!'
              });
            });

            map.setCenter(latlngbounds.getCenter());
            map.fitBounds(latlngbounds); 

            FeedbackView.prototype.dismiss();
          });
        },

        error: function(error) {
          FeedbackView.prototype.errorMessage("Problem loading trips: " + error.message);
        }
      });
    }
  });

  return MapView;
});