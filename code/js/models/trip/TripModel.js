define([
  'parse'
], function(Parse) {
  
  var Trip = Parse.Object.extend("Trip", {

    defaults: {
      point : null,
      destination : null,
      startDate : null,
      endDate : null,
      notes : "",
      nomad : null
    },

    initialize: function() {
      if (!this.get("nomad")) {
        this.set({"nomad": Parse.User.current()});
      }
    },

    formattedStartDate: function() {
      var startDate = this.get("startDate");

      if (startDate && startDate instanceof Date) {
        return startDate.toDateString();
      }
    },
    
    formattedEndDate: function() {
      var endDate = this.get("endDate");

      if (endDate && endDate instanceof Date) {
        return endDate.toDateString();
      }
    }

  });

  return Trip;

});

