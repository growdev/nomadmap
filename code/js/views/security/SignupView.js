define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/profile/ProfileView',
  'views/feedback/FeedbackView',
  'text!templates/security/signupTemplate.html'
], function($, _, Backbone, Parse, ProfileView, FeedbackView, ActivityView, signupTemplate){

  var SignupView = Backbone.View.extend({
    el: $("#page"),

    events: {
      "submit form.signup-form": "signUp"
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      var password2 = this.$("#signup-password2").val();

      if (password != password2) {
        FeedbackView.prototype.errorMessage("Passwords don't match, please try again");
        return false;
      }

      var email = this.$("#signup-email").val();

      if (!email || email == "") {
        FeedbackView.prototype.errorMessage("Please enter an email address");
        return false;
      }
      
      var nomad = new Parse.User();
      nomad.set("username", username);
      nomad.set("password", password);
      nomad.set("email", email);
      
      FeedbackView.prototype.activityMessage("Creating account");

      nomad.signUp(null, {
        success: function(nomad) {
          $('.nav').append("<li class='logoff'><a href='#/logoff'>Logoff</a></li>");
          FeedbackView.prototype.successMessage("Account created");
          
          SignupView.prototype.goTo("#/editProfile");      
        },

        error: function(nomad, error) {
          FeedbackView.prototype.errorMessage(error.message);
      
          self.$(".signup-form button").removeAttr("disabled");
        }
      });

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },

    render: function(){
      $('.menu li').removeClass('active');
      
      this.$el.html(signupTemplate);
 
    }
  });
  return SignupView;
  
});
