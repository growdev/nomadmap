define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/feedback/feedbackTemplate.html'
], function($, _, Backbone, feedbackTemplate){

  var FooterView = Backbone.View.extend({
    el: $("#feedback"),

    activityMessage: function(message) {
      var compiledTemplate = _.template( feedbackTemplate, {type: 'activity', message:message} );
      this.el.html(compiledTemplate);
    },

    successMessage: function(message) {
      var compiledTemplate = _.template( feedbackTemplate, {type: 'success', message:message} );
      this.el.html(compiledTemplate);
    },

    errorMessage: function(message) {
      var compiledTemplate = _.template( feedbackTemplate, {type: 'error', message:message} );
      this.el.html(compiledTemplate);
    },

    dismiss: function() {
      this.el.html('');
    }

  });

  return FooterView;
  
});
