define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/feedback/FeedbackView',
  'text!templates/security/resetTemplate.html'
], function($, _, Backbone, Parse, FeedbackView, resetTemplate){

  var LoginView = Backbone.View.extend({
    // el: $("#page"),

    events: {
      "submit form.reset-form": "requestReset"
    },

    render: function(){
      $('.menu li').removeClass('active');
      
      this.$el.html(resetTemplate);
 
    },

    requestReset: function(e) {
      var self = this;
      var email = this.$("#account-email").val();
      
      FeedbackView.prototype.activityMessage("Requesting reset...");
      
      Parse.User.requestPasswordReset(email, {
        success: function() {
          FeedbackView.prototype.successMessage("Request sent. Check your mail :)");
        },
        error: function(error) {
          FeedbackView.prototype.errorMessage("There was a problem: " + error.message);
          this.$(".reset-form button").attr("disabled", "enabled");
        }
      });

      this.$(".reset-form button").attr("disabled", "disabled");

      return false;
    },

  });

  return LoginView;
  
});
