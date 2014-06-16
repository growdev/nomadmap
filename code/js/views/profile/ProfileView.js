define([
  'jquery',
  'underscore',
  'backbone',
  'views/profile/ProfileView',
  'text!templates/profile/profileTemplate.html'
], function($, _, Backbone, ProfileView, profileTemplate){

  var ProfileView = Backbone.View.extend({
    el: $("#page"),
    render: function(){
     
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      
      var compiledTemplate = _.template( profileTemplate, {} );
      this.$el.html(compiledTemplate);
    }
  });

  return ProfileView;
});
