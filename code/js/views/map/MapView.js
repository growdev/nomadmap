define([
          'jquery',
          'underscore',
          'backbone',
          'parse',
          'text!templates/map/mapTemplate.html'
        ], function ($, _, Backbone, Parse, viewTemplate){

  var MapView = Backbone.View.extend({
    el: $("#page"),
    render: function(){
      
      var self = this;

      $('.menu li').removeClass('active');
      $('.menu li a[href="#/map"]').parent().addClass('active');

      this.$el.html(viewTemplate);
      require(['async!http://maps.google.com/maps/api/js?sensor=false!callback'], function(){
 
        var mapDiv = document.getElementById('map-canvas');
        
        var map = new google.maps.Map(mapDiv, {
          center: new google.maps.LatLng(37.4419, -122.1419),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          navigationControl: true,
          navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
          }
        });
        
      });
      
    }
  });

  return MapView;
});