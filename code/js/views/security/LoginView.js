define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/feedback/FeedbackView',
  'text!templates/security/loginTemplate.html'
], function($, _, Backbone, Parse, FeedbackView, loginTemplate){

  var LoginView = Backbone.View.extend({
    // el: $("#page"),

    events: {
      "submit form.login-form": "logIn"
    },

    render: function(){
      $('.menu li').removeClass('active');
      
      this.$el.html(loginTemplate);
 
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      FeedbackView.prototype.activityMessage("Logging in");
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          $('.logoff').remove(); // for some reason if we've already logged in this call back gets hit once for each previous login so remove the rogue logins
          $('.nav').append("<li class='logoff'><a href='#/logoff'>Logoff</a></li>");

          FeedbackView.prototype.successMessage("Welcome, " + user.get('name'));
        
          LoginView.prototype.goTo("#/map");
        },

        error: function(user, error) {

          FeedbackView.prototype.errorMessage("Invalid username or password. Please try again.");
          self.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

  });

  return LoginView;
  
});
