define([
  'parse',
  'models/trip/TripModel'
], function(Parse, TripModel) {
  
  var TripsCollection = Parse.Collection.extend("TripsCollection", {

    model: TripModel
    // query: (new Parse.Query(TripModel)).greaterThanOrEqualTo("endDate", new Date()),

    // tripsForUser: function(user) {
    //   return this.filter(function(trip){ return trip.get('nomad') == user; });
    // }

  });

  return TripsCollection;

});

