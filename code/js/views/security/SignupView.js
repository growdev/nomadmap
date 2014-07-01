define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'views/profile/ProfileView',
  'text!templates/security/signupTemplate.html'
], function($, _, Backbone, Parse, ProfileView, signupTemplate){

  var SignupView = Backbone.View.extend({
    el: $("#page"),

    events: {
      "submit form.signup-form": "signUp"
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      
      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
          SignupView.prototype.goTo("#/profile");
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(error.message).show();
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
