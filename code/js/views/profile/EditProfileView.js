define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'jquery/jquery.toTitleCase',
  'views/feedback/FeedbackView',
  'text!templates/profile/editProfileTemplate.html'
], function($, _, Backbone, Parse, toTitleCase, FeedbackView, editProfileTemplate){

  var EditProfileView = Backbone.View.extend({
    el: $("#page"),

    events: {
      "submit form.edit-profile-form": "save"
    },

    render: function(){
     
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      
      var user = Parse.User.current();
      var compiledTemplate = _.template( editProfileTemplate, {user: user} );
      this.$el.html(compiledTemplate);
    },

    save: function() {
      
      self = this;

      var user = Parse.User.current();
      var fields = ['name', 'whatIDo', 'facebook', 'twitter', 'foursquare', 'website1', 'website2', 'website3', 'website4', 'website5'];
      
      _.each(fields, function(field, index, list) {
          user.set(field, $("input[name=" + field + "]").val());  
      });
        
      user.set('aboutMe', $("textarea[name=aboutMe]").val());
      
      FeedbackView.prototype.activityMessage("Saving profile data");

      user.save(null, {
        success: function(user) {
          FeedbackView.prototype.successMessage("Profile updated");
          self.render();
        },

        error: function(user, error) {
          FeedbackView.prototype.errorMessage("Error saving: " + error.message);
          console.log(error.message);
        }
      });        

      return false;
    }
  });

  return EditProfileView;
});
