define([
          'jquery',
          'underscore',
          'backbone',
          'parse',
          'text!templates/map/mapTemplate.html',
          'text!templates/map/markerTemplate.html',
          'collections/trips/TripsCollection',
          'models/trip/TripModel',
          'views/feedback/FeedbackView',
          'jquery/jQuery.dbFormat',
          'jquery/jQuery.ui'
        ], function ($, _, Backbone, Parse, viewTemplate, markerTemplate, TripsCollection, TripModel, FeedbackView, dbFormat, datePicker){

  var MapView = Backbone.View.extend({
    // el: $("#page"),
   
    events: {
      "change input[name=pick-date] ": "updateMap"
    },

    // There's probably a neater way to do this.
    fields: [
      { field: "whatIDo", display : "What I Do"},
      { field: "aboutMe", display : "About Me"}
      ],
    urls: [
      { field: "facebook", display : "What I Do", urlPrefix: "https://wwww.facebook.com/" },
      { field: "twitter", display : "What I Do", urlPrefix: "https://twiiter.com/" },
      { field: "foursquare", display : "What I Do", urlPrefix: "https://foursquare.com/" },
      { field: "website1", display : "Web 1", urlPrefix: "http://" },
      { field: "website2", display : "Web 2", urlPrefix: "http://" },
      { field: "website3", display : "Web 3", urlPrefix: "http://" },
      { field: "website4", display : "Web 4", urlPrefix: "http://" },
      { field: "website5", display : "Web 5", urlPrefix: "http://" }
    ],

    render: function(){
      
      var self = this;

      $('.menu li').removeClass('active');
      $('.menu li a[href="#/map"]').parent().addClass('active');

      this.$el.html(viewTemplate);
      
      $('.date-picker').datepicker({
        numberOfMonths: 3,
        showButtonPanel: true
      });
      $('.date-picker').datepicker("setDate", new Date());

      this.updateMap();
      
    }, 

    updateMap: function () {

      var dateField = $('.date-picker').datepicker("getDate");

      if (!dateField || dateField == '') {
        FeedbackView.prototype.errorMessage("Please enter a valid date");
        return;
      }
      
      var dateObject = new Date(dateField);

      var myTrips = new TripsCollection();
      myTrips.query = new Parse.Query(TripModel);
      myTrips.query.lessThanOrEqualTo('startDate', dateObject);
      myTrips.query.greaterThanOrEqualTo('endDate', dateObject);
      myTrips.query.include('nomad');

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

              var nomad = trip.get('nomad');
              var html = _.template( markerTemplate, {
                user: nomad, 
                fields: self.fields, 
                urls: self.urls, 
                destination: trip.get('destination'),
                startDate: new Intl.DateTimeFormat().format(trip.get('startDate')),
                endDate: new Intl.DateTimeFormat().format(trip.get('endDate'))
              });

              var infowindow = new google.maps.InfoWindow({
                  content: html
              });

              var myLatlng = new google.maps.LatLng(point.latitude, point.longitude);
        
              latlngbounds.extend(myLatlng);
              var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: nomad.get('name')
              });

              google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
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