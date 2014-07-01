define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'jquery/jquery.toTitleCase',
  'text!templates/profile/profileTemplate.html'
], function($, _, Backbone, Parse, toTitleCase, profileTemplate){

  var ProfileView = Backbone.View.extend({
    el: $("#page"),
    render: function(){
     
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      
      var user = Parse.User.current();
      var compiledTemplate = _.template( profileTemplate, {user: user} );
      this.$el.html(compiledTemplate);
    }
  });

  return ProfileView;
});
