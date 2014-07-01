define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'text!templates/security/loginTemplate.html'
], function($, _, Backbone, Parse, loginTemplate){

  var LoginView = Backbone.View.extend({
    el: $("#page"),

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
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          new ManageTodosView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

  });

  return LoginView;
  
});
